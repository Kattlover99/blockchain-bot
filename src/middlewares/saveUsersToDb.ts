import {MiddlewareFn} from "grammy";
import ContextModel from "../models/Context";
import {$db} from "../helpers/makeDb";
import UserModel from "../models/User";
import {ObjectId} from "mongodb";
import crypto from "crypto";

const saveUsersToDb: MiddlewareFn<ContextModel> = async(ctx, next) => {
  if(!ctx.from) {
    return;
  }

  let user: UserModel | null = await $db.users.findOne({"telegram.id": ctx.from?.id});

  if(!user) {
    const keyPair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    user = {
      _id: new ObjectId(),
      telegram: ctx.from,
      createdAt: new Date(),
      key: {
        private: keyPair.privateKey,
        public: keyPair.publicKey,
        hash: crypto.createHash("sha256").update(keyPair.publicKey).digest("base64")
      }
    };

    await $db.users.insertOne(user);
  }

  ctx.$user = user;
  return next();
};

export default saveUsersToDb;
