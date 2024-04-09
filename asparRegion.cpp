#include <node.h>
#include <nan.h>
#include <string>
#include <vector>
#include <iomanip> 
#include <sstream>
#include <openssl/aes.h>
#include <openssl/err.h>
#include <openssl/evp.h>
#include <openssl/sha.h>

class ElectronNodeEngine: public node::ObjectWrap {
    public:
        static void Init(v8::Local<v8::Object> exports) {
        v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
        tpl->SetClassName(Nan::New("ElectronNodeEngine").ToLocalChecked());
        tpl->InstanceTemplate()->SetInternalFieldCount(1);

        NODE_SET_PROTOTYPE_METHOD(tpl, "propRegion", PropRegion);
        NODE_SET_PROTOTYPE_METHOD(tpl, "encryptString", EncryptString);
        NODE_SET_PROTOTYPE_METHOD(tpl, "decryptString", DecryptString);
        NODE_SET_PROTOTYPE_METHOD(tpl, "createHash", CreateHash);
        NODE_SET_PROTOTYPE_METHOD(tpl, "decodeHash", DecodeHash);

        constructor.Reset(tpl->GetFunction());
        exports->Set(Nan::New("ElectronNodeEngine").ToLocalChecked(), tpl->GetFunction());
    }

        std::string propRegion(std::string input);
        std::string encryptString(std::string input);
        std::string decryptString(std::string encrypted);
        std::string createHash(std::string input);
        std::string decodeHash(std::string hash);
        int value_check(int number);
        char charFromdigit(int digit);
        int reverseNumber(int number);

    private:
        const std::string key = "tamtob-cibbe6-cakHav";
        const std::string iv = "4ca00ff4c898d61e1edbf1800618fb2l";
        explicit ElectronNodeEngine() {}
        ~ElectronNodeEngine() {}

        static void New(const v8::FunctionCallbackInfo<v8::Value>& args) {
            if (args.IsConstructCall()) {
                ElectronNodeEngine* obj = new ElectronNodeEngine();
                obj->Wrap(args.This());
                args.GetReturnValue().Set(args.This());
            } else {
                const int argc = 1;
                v8::Local<v8::Value> argv[argc] = { args[0] };
                v8::Local<v8::Function> cons = Nan::New(constructor);
                args.GetReturnValue().Set(cons->NewInstance(argc, argv));
            }
        }

        static Nan::Persistent<v8::Function> constructor;

};
std::string ElectronNodeEngine::propRegion(std::string input) {
    std::string first_char = input.substr(0, 12);
    std::string last_char = input.substr(12, input.length());
    int esum = 0;
    int osum = 0;
    for (int index = 0; index < last_char.length(); index++) {
        char charAtIndex = last_char[index];
        if (index % 2 == 0) {
            int numericValue = charAtIndex + index;
            esum = esum + numericValue;
        } else {
            int numericValue = charAtIndex - index;
            osum = osum + numericValue;
        }
    }
    int esum1 = value_check(esum / 100);
    int esum2 = value_check(esum % 100);
    int osum1 = value_check(osum / 100);
    int osum2 = value_check(osum % 100);
    std::string k1 = std::string(1, charFromdigit(esum1)) + std::string(1, charFromdigit(reverseNumber(esum1)));
    std::string k2 = std::string(1, charFromdigit(esum2)) + std::string(1, charFromdigit(reverseNumber(esum2)));
    std::string k3 = std::string(1, charFromdigit(osum1)) + std::string(1, charFromdigit(reverseNumber(osum1)));
    std::string k4 = std::string(1, charFromdigit(osum2)) + std::string(1, charFromdigit(reverseNumber(osum2)));

    k1 = first_char.substr(0, 3) + k1 + '-';
    k2 = first_char.substr(3, 6) + k2 + '-';
    k3 = first_char.substr(6, 9) + k3 + '-';
    k4 = first_char.substr(9, 12) + k4;
    return k1 + k2 + k3 + k4;
}

std::string ElectronNodeEngine::encryptString(std::string input) {
    EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
    std::string encrypted;
    int len = 0;
    int ciphertext_len = 0;

    if(!EVP_EncryptInit_ex(ctx, EVP_aes_256_cbc(), NULL, (unsigned char*)key.c_str(), (unsigned char*)iv.c_str())) {
        return "Error in ecrypting the data.";
    }

    unsigned char ciphertext[input.size() + EVP_CIPHER_block_size(EVP_aes_256_cbc())];

    if(!EVP_EncryptUpdate(ctx, ciphertext, &len, (unsigned char*)input.c_str(), input.size())) {
        return "Error in ecrypting the data.";
    }
    ciphertext_len = len;

    if(!EVP_EncryptFinal_ex(ctx, ciphertext + len, &len)) {
        return "Error in ecrypting the data.";
    }
    ciphertext_len += len;

    for(int i = 0; i < ciphertext_len; i++) {
        char hex[3];
        sprintf(hex, "%02x", ciphertext[i]);
        encrypted += hex;
    }

    EVP_CIPHER_CTX_free(ctx);

    return encrypted;
}

std::string ElectronNodeEngine::decryptString(std::string encrypted) {
    EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
    std::string decrypted;
    int len = 0;
    int plaintext_len = 0;

    if(!EVP_DecryptInit_ex(ctx, EVP_aes_256_cbc(), NULL, (unsigned char*)key.c_str(), (unsigned char*)iv.c_str())) {
        return "Error in decrypting the data.";
    }

    unsigned char ciphertext[encrypted.size()];
    unsigned char plaintext[encrypted.size() + EVP_CIPHER_block_size(EVP_aes_256_cbc())];

    for(int i = 0; i < encrypted.size(); i+=2) {
        std::string byte = encrypted.substr(i,2);
        ciphertext[i/2] = (char) strtol(byte.c_str(), NULL, 16);
    }

    if(!EVP_DecryptUpdate(ctx, plaintext, &len, ciphertext, encrypted.size()/2)) {
        return "Error in decrypting the data.";
    }
    plaintext_len = len;

    if(!EVP_DecryptFinal_ex(ctx, plaintext + len, &len)) {
        return "Error in decrypting the data.";
    }
    plaintext_len += len;

    decrypted = std::string((char*)plaintext, plaintext_len);

    EVP_CIPHER_CTX_free(ctx);

    return decrypted;
}

std::string ElectronNodeEngine::createHash(std::string input) {
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256_CTX sha256;
    SHA256_Init(&sha256);
    SHA256_Update(&sha256, input.c_str(), input.size());
    SHA256_Final(hash, &sha256);
    std::stringstream ss;
    for(int i = 0; i < SHA256_DIGEST_LENGTH; i++) {
        ss << std::hex << std::setw(2) << std::setfill('0') << (int)hash[i];
    }
    return ss.str();
}

int ElectronNodeEngine::value_check(int number) {
    if (number >= 10 && number <= 200) {
    return number;
    }
    if (number < 2) {
        return value_check(number + 1);
    }
    if (number < 10) {
        return number * 12;
    } else if (number > 200) {
        return value_check(number / 10);
    } else {
        return number;
    }
}

char ElectronNodeEngine::charFromdigit(int digit) {
    if (digit >= 91 && digit <= 96) {
        return charFromdigit((digit % 10) * 10);
    }
    if (digit >= 64 && digit <= 122) {
        return static_cast<char>(digit);
    } else {
        if (digit < 64) {
            int temp = (64 % digit) + 64;
            return static_cast<char>(temp);
        } else if (digit > 122) {
            int temp = 122 - ((digit - 122) / 10);
            return static_cast<char>(temp);
        }
    }
    return ' '; // default return value
}

int ElectronNodeEngine::reverseNumber(int number) {
    int rev = 0;
    while (number > 0) {
        int rem = number % 10;
        rev = rev * 10 + rem;
        number = number / 10;
    }
    return rev;
}
Nan::Persistent<v8::Function> ElectronNodeEngine::constructor;
void Initialize(v8::Local<v8::Object> exports) {
    ElectronNodeEngine::Init(exports);
}
NODE_MODULE(addon, Initialize)
