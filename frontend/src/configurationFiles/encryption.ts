import {
  keyhelper,
  ProtocolAddress,
  SessionBuilder,
  SessionCipher,
  SessionRecord,
} from "@raphaelvserafim/libsignal";
import { Buffer } from "buffer";
import { makeRequest } from "./web_interface";
import { refreshToken } from "./requests";
import { callNotification } from "../Notification/notifications";
import { useDataStore, useKeysStore, useProfileStore } from "./config";

// ─── Утилиты Base64 ──────────────────────────────────────
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
};

const base64ToUint8Array = (base64: string): Uint8Array => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const uint8ArrayToBase64 = (arr: Uint8Array): string => {
  let binary = "";
  arr.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
};

// ─── Хранилище сессий в памяти (чтобы избежать порчи JSON'ом) ─
const sessionMap = new Map<string, any>();

// ─── Восстановление пары ключей из стора ────────────────
function _parseStoredKey(storeValue: any) {
  if (!storeValue) return undefined;

  let priv = storeValue.privKey ?? storeValue.privateKey;
  let pub = storeValue.pubKey ?? storeValue.publicKey;

  if (priv instanceof ArrayBuffer) {
    priv = new Uint8Array(priv);
  } else if (typeof priv === "string") {
    priv = base64ToUint8Array(priv);
  }

  if (pub instanceof ArrayBuffer) {
    pub = new Uint8Array(pub);
  } else if (typeof pub === "string") {
    pub = base64ToUint8Array(pub);
  }

  if (!priv || !pub) {
    console.error("EncryptionStore: missing key material", storeValue);
    return undefined;
  }

  return {
    pubKey: pub, // Uint8Array
    privKey: priv, // Uint8Array
  };
}

// ─── Хранилище для libsignal (SignalProtocolStore) ─────
export const encryptionStore = {
  // Идентити‑ключ
  getIdentityKeyPair: async () => {
    return _parseStoredKey(useKeysStore.getState().keys.identityKey);
  },
  getOurIdentity: async function () {
    return this.getIdentityKeyPair();
  },
  ourIdentityKey: async function () {
    return this.getIdentityKeyPair();
  },

  storeIdentityKey: async (identityKeyPair: any) => {
    const serialized = {
      pubKey: arrayBufferToBase64(identityKeyPair.pubKey),
      privKey: arrayBufferToBase64(identityKeyPair.privKey),
    };
    useKeysStore.getState().setIdentityKey(serialized);
  },

  getLocalRegistrationId: async () => {
    return useKeysStore.getState().keys.registrationId;
  },

  getOurRegistrationId: async function () {
    return this.getLocalRegistrationId();
  },

  // Подписанный пре‑ключ
  loadSignedPreKey: async (keyId: number) => {
    const spk = useKeysStore.getState().keys.signedPreKey;
    if (!spk || !spk.keyPair) return undefined;
    return _parseStoredKey(spk.keyPair);
  },
  ourSignedPreKey: async (keyId: number) => this.loadSignedPreKey(keyId),
  ourSignedKey: async (keyId: number) => this.loadSignedPreKey(keyId),

  storeSignedPreKey: async (signedPreKey: any) => {
    const keyPair = signedPreKey.keyPair || signedPreKey;
    const pub = keyPair.pubKey || keyPair.publicKey;
    const priv = keyPair.privKey || keyPair.privateKey;
    const sig = signedPreKey.signature;
    const keyId = signedPreKey.keyId;

    if (!pub || !priv || !sig) {
      console.error("Invalid signedPreKey object", signedPreKey);
      return;
    }

    useKeysStore.getState().setSignedPreKey({
      keyId,
      keyPair: {
        pubKey: arrayBufferToBase64(pub),
        privKey: arrayBufferToBase64(priv),
      },
      signature: arrayBufferToBase64(sig),
    });
  },

  // Одноразовые пре‑ключи
  loadPreKey: async (keyId: number) => {
    return _parseStoredKey(useKeysStore.getState().keys.preKeys[keyId]);
  },

  storePreKey: async (keyId: number, keyPair: any) => {
    const pub = keyPair.pubKey || keyPair.publicKey;
    const priv = keyPair.privKey || keyPair.privateKey;
    if (!pub || !priv) return;

    const serialized = {
      pubKey: arrayBufferToBase64(pub),
      privKey: arrayBufferToBase64(priv),
    };

    useKeysStore.setState((state) => {
      state.keys.preKeys[keyId] = serialized;
    });
  },

  removePreKey: async (keyId: number) => {
    useKeysStore.setState((state) => {
      delete state.keys.preKeys[keyId];
    });
  },

  // Сессии (хранятся в памяти, не в Zustand!)
  loadSession: async (id: string) => {
    return sessionMap.get(id);
  },
  storeSession: async (id: string, record: any) => {
    sessionMap.set(id, record);
  },
  removeSession: async (id: string) => {
    sessionMap.delete(id);
  },

  // Идентичности (для доверия)
  saveIdentity: async (name: string, key: any) => {
    useKeysStore.setState((state) => {
      if (!state.keys.identities) state.keys.identities = {};
      state.keys.identities[name] = key;
    });
    return true;
  },
  isTrustedIdentity: async () => true,
};

// ─── Отправка ключей на сервер ──────────────────────────
export async function createKeys(countKeys = 100) {
  const accessToken = useDataStore.getState().accessToken;
  const preKeys = [];

  for (let i = 0; i < 100; i++) {
    const key = keyhelper.generatePreKey(i);
    await encryptionStore.storePreKey(key.keyId, key.keyPair);
    preKeys.push({
      keyId: key.keyId,
      keyPair: {
        privKey: arrayBufferToBase64(key.keyPair.privKey),
        pubKey: arrayBufferToBase64(key.keyPair.pubKey),
      },
    });
  }

  const keys = useKeysStore.getState().keys;

  const response = await makeRequest("/web/keys/public", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      registration_id: keys.registrationId,
      identity_key: keys.identityKey.pubKey,
      signed_key: {
        index: keys.signedPreKey.keyId,
        signed_prekey: keys.signedPreKey.keyPair.pubKey,
        signature: keys.signedPreKey.signature,
      },
      pre_keys: preKeys.map((key) => ({
        pre_key: key.keyPair.pubKey,
        index: key.keyId,
      })),
    }),
  });

  if (response.status === 413) {
    createKeys(countKeys / 2);
  } else if (response.status === 401) {
    refreshToken();
  } else if (response.status === 500) {
    callNotification(
      "Сервер лег поспать, пните программиста чтобы починил",
      "error"
    );
  }
}

export async function addPreKeys(addCount: number) {
  const accessToken = useDataStore.getState().accessToken;
  const preKeys = [];

  for (let i = addCount; i < addCount + 100; i++) {
    const key = keyhelper.generatePreKey(i);
    await encryptionStore.storePreKey(key.keyId, key.keyPair);
    preKeys.push({
      keyId: key.keyId,
      keyPair: {
        privKey: arrayBufferToBase64(key.keyPair.privKey),
        pubKey: arrayBufferToBase64(key.keyPair.pubKey),
      },
    });
  }

  const response = await makeRequest("/web/keys/pre", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      pre_keys: preKeys.map((key) => key.keyPair.pubKey),
    }),
  });

  if (response.status === 413) {
    addPreKeys(addCount / 2);
  } else if (response.status === 401) {
    refreshToken();
  } else if (response.status === 500) {
    callNotification(
      "Сервер лег поспать, пните программиста чтобы починил",
      "error"
    );
  }
}

// ─── Создание сессии ────────────────────────────────────
export async function createSession(oponentId: string) {
  const accessToken = useDataStore.getState().accessToken;
  const profile = useProfileStore.getState().profile;

  const response = await makeRequest(
    "/web/keys",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
    { user_id: oponentId }
  );

  if (response.status !== 200) return;

  const keys: any = await response.json();

  if (keys.pre_key == null) {
    await addPreKeys(100);
    return createSession(oponentId);
  }

  const address = new ProtocolAddress(oponentId, 1);
  const builder = new SessionBuilder(encryptionStore, address);

  const baseBundle = {
    registrationId: parseInt(keys.registration_id, 10),
    deviceId: 1,
    preKey: {
      keyId: keys.pre_key.index,
      publicKey: base64ToUint8Array(keys.pre_key.pre_key),
    },
    signedPreKey: {
      keyId: keys.signed_key.index,
      publicKey: base64ToUint8Array(keys.signed_key.signed_prekey),
      signature: base64ToUint8Array(keys.signed_key.signature),
    },
    identityKey: base64ToUint8Array(keys.identity_key),
  };

  // Установка сессии с возможным добавлением эфемерного ключа
  try {
    await builder.initOutgoing(baseBundle);
  } catch (err: any) {
    if (err.message?.includes("ourEphemeralKey")) {
      const ephemeralKeyPair = keyhelper.generatePreKey(Date.now()).keyPair;
      const bundleWithEphemeral = {
        ...baseBundle,
        ourEphemeralKey: ephemeralKeyPair,
      };
      await builder.initOutgoing(bundleWithEphemeral);
    } else {
      throw err;
    }
  }

  // Сессия сохранена в sessionMap. Первое сообщение обязано быть PreKey‑типом.
  const masterKeyPayload = await encrypt("INIT", oponentId, 3);

  const newChat = await makeRequest("/web/data/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      type: masterKeyPayload.type,
      content: masterKeyPayload.body,
      sender: profile?.id,
      reciver: oponentId,
    }),
  });

  if (newChat.status === 201) {
    const response = await newChat.json();

    useProfileStore.getState().addContact({
      chat_id: response.chat_id,
      permissions: [profile?.id, oponentId],
    });

    console.log(useProfileStore.getState().profile);
  }
}

// ─── Шифрование сообщения ─────────────────────────────
export async function encrypt(
  content: string,
  opponentId: string,
  forceType?: number
): Promise<{ type: string; body: string }> {
  const address = new ProtocolAddress(opponentId, 1);
  const cipher = new SessionCipher(encryptionStore, address);

  const plaintextBuffer = Buffer.from(content, "utf-8");
  const encrypted = await cipher.encrypt(plaintextBuffer);

  let serialized: Uint8Array;

  // Пытаемся получить бинарное представление, независимо от того,
  // что вернула библиотека (объект с serialize, body или уже Buffer)
  if (typeof encrypted.serialize === "function") {
    serialized = new Uint8Array(encrypted.serialize());
  } else if (encrypted instanceof Uint8Array || encrypted instanceof ArrayBuffer) {
    serialized = new Uint8Array(
      encrypted instanceof ArrayBuffer ? encrypted : encrypted.buffer
    );
  } else if ((encrypted as any).body) {
    serialized = new Uint8Array((encrypted as any).body);
  } else {
    // fallback
    serialized = new Uint8Array(encrypted as any);
  }

  const bodyBase64 = uint8ArrayToBase64(serialized);

  let type: number;
  if (forceType) {
    type = forceType;
  } else if ((encrypted as any).preKeyId !== undefined) {
    type = 3;
  } else {
    // Если не можем определить – считаем обычным сообщением
    type = 1;
  }

  return { type, body: bodyBase64 };
}

// ─── Расшифровка сообщения ────────────────────────────
export async function decrypt(
  payload: { type: string; body: string },
  opponentId: string
): Promise<string> {
  const address = new ProtocolAddress(opponentId, 1);
  const cipher = new SessionCipher(encryptionStore, address);

  const binary = base64ToUint8Array(payload.body);

  const decryptPreKey = () =>
    cipher.decryptPreKeyWhisperMessage(binary.buffer, "binary");
  const decryptSignal = () =>
    cipher.decryptWhisperMessage(binary.buffer, "binary");

  let plaintext: ArrayBuffer;

  if (payload.type === "prekey_message") {
    try {
      plaintext = await decryptPreKey();
    } catch (e) {
      plaintext = await decryptSignal();
    }
  } else {
    try {
      plaintext = await decryptSignal();
    } catch (e) {
      plaintext = await decryptPreKey();
    }
  }

  return new TextDecoder().decode(plaintext);
}