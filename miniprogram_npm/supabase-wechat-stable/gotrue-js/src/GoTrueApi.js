"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_1 = require("./lib/fetch");
const constants_1 = require("./lib/constants");
const cookies_1 = require("./lib/cookies");
const helpers_1 = require("./lib/helpers");
class GoTrueApi {
    constructor({ url = '', headers = {}, cookieOptions, }) {
        this.url = url;
        this.headers = headers;
        this.cookieOptions = Object.assign(Object.assign({}, constants_1.COOKIE_OPTIONS), cookieOptions);
    }
    /**
     * Creates a new user using their email address.
     * @param email The email address of the user.
     * @param password The password of the user.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     *
     * @returns A logged-in session if the server has "autoconfirm" ON
     * @returns A user if the server has "autoconfirm" OFF
     */
    signUpWithEmail(email, password, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headers = Object.assign({}, this.headers);
                let queryString = '';
                if (options.redirectTo) {
                    queryString = '?redirect_to=' + encodeURIComponent(options.redirectTo);
                }
                const data = yield fetch_1.post(`${this.url}/signup${queryString}`, { email, password }, { headers });
                let session = Object.assign({}, data);
                if (session.expires_in)
                    session.expires_at = helpers_1.expiresAt(data.expires_in);
                return { data: session, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Logs in an existing user using their email address.
     * @param email The email address of the user.
     * @param password The password of the user.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     */
    signInWithEmail(email, password, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headers = Object.assign({}, this.headers);
                let queryString = '?grant_type=password';
                if (options.redirectTo) {
                    queryString += '&redirect_to=' + encodeURIComponent(options.redirectTo);
                }
                const data = yield fetch_1.post(`${this.url}/token${queryString}`, { email, password }, { headers });
                let session = Object.assign({}, data);
                if (session.expires_in)
                    session.expires_at = helpers_1.expiresAt(data.expires_in);
                return { data: session, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Signs up a new user using their phone number and a password.
     * @param phone The email address of the user.
     * @param password The password of the user.
     */
    signUpWithPhone(phone, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headers = Object.assign({}, this.headers);
                const data = yield fetch_1.post(`${this.url}/signup`, { phone, password }, { headers });
                let session = Object.assign({}, data);
                if (session.expires_in)
                    session.expires_at = helpers_1.expiresAt(data.expires_in);
                return { data: session, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Logs in an existing user using their phone number and password.
     * @param phone The email address of the user.
     * @param password The password of the user.
     */
    signInWithPhone(phone, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headers = Object.assign({}, this.headers);
                let queryString = '?grant_type=password';
                const data = yield fetch_1.post(`${this.url}/token${queryString}`, { phone, password }, { headers });
                let session = Object.assign({}, data);
                if (session.expires_in)
                    session.expires_at = helpers_1.expiresAt(data.expires_in);
                return { data: session, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Sends a magic login link to an email address.
     * @param email The email address of the user.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     */
    sendMagicLinkEmail(email, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headers = Object.assign({}, this.headers);
                let queryString = '';
                if (options.redirectTo) {
                    queryString += '?redirect_to=' + encodeURIComponent(options.redirectTo);
                }
                const data = yield fetch_1.post(`${this.url}/magiclink${queryString}`, { email }, { headers });
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Sends a mobile OTP via SMS. Will register the account if it doesn't already exist
     * @param phone The user's phone number WITH international prefix
     */
    sendMobileOTP(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headers = Object.assign({}, this.headers);
                const data = yield fetch_1.post(`${this.url}/otp`, { phone }, { headers });
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Send User supplied Mobile OTP to be verified
     * @param phone The user's phone number WITH international prefix
     * @param token token that user was sent to their mobile phone
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     */
    verifyMobileOTP(phone, token, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headers = Object.assign({}, this.headers);
                const data = yield fetch_1.post(`${this.url}/verify`, { phone, token, type: 'sms', redirect_to: options.redirectTo }, { headers });
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Sends an invite link to an email address.
     * @param email The email address of the user.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     */
    inviteUserByEmail(email, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headers = Object.assign({}, this.headers);
                let queryString = '';
                if (options.redirectTo) {
                    queryString += '?redirect_to=' + encodeURIComponent(options.redirectTo);
                }
                const data = yield fetch_1.post(`${this.url}/invite${queryString}`, { email }, { headers });
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Sends a reset request to an email address.
     * @param email The email address of the user.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     */
    resetPasswordForEmail(email, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headers = Object.assign({}, this.headers);
                let queryString = '';
                if (options.redirectTo) {
                    queryString += '?redirect_to=' + encodeURIComponent(options.redirectTo);
                }
                const data = yield fetch_1.post(`${this.url}/recover${queryString}`, { email }, { headers });
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Create a temporary object with all configured headers and
     * adds the Authorization token to be used on request methods
     * @param jwt A valid, logged-in JWT.
     */
    _createRequestHeaders(jwt) {
        const headers = Object.assign({}, this.headers);
        headers['Authorization'] = `Bearer ${jwt}`;
        return headers;
    }
    /**
     * Removes a logged-in session.
     * @param jwt A valid, logged-in JWT.
     */
    signOut(jwt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fetch_1.post(`${this.url}/logout`, {}, { headers: this._createRequestHeaders(jwt), noResolveJson: true });
                return { error: null };
            }
            catch (error) {
                return { error };
            }
        });
    }
    /**
     * Generates the relevant login URL for a third-party provider.
     * @param provider One of the providers supported by GoTrue.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     * @param scopes A space-separated list of scopes granted to the OAuth application.
     */
    getUrlForProvider(provider, options) {
        let urlParams = [`provider=${encodeURIComponent(provider)}`];
        if (options === null || options === void 0 ? void 0 : options.redirectTo) {
            urlParams.push(`redirect_to=${encodeURIComponent(options.redirectTo)}`);
        }
        if (options === null || options === void 0 ? void 0 : options.scopes) {
            urlParams.push(`scopes=${encodeURIComponent(options.scopes)}`);
        }
        return `${this.url}/authorize?${urlParams.join('&')}`;
    }
    /**
     * Gets the user details.
     * @param jwt A valid, logged-in JWT.
     */
    getUser(jwt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fetch_1.get(`${this.url}/user`, { headers: this._createRequestHeaders(jwt) });
                return { user: data, data, error: null };
            }
            catch (error) {
                return { user: null, data: null, error };
            }
        });
    }
    /**
     * Updates the user data.
     * @param jwt A valid, logged-in JWT.
     * @param attributes The data you want to update.
     */
    updateUser(jwt, attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fetch_1.put(`${this.url}/user`, attributes, {
                    headers: this._createRequestHeaders(jwt),
                });
                return { user: data, data, error: null };
            }
            catch (error) {
                return { user: null, data: null, error };
            }
        });
    }
    /**
     * Delete an user.
     * @param uid The user uid you want to remove.
     * @param jwt A valid JWT. Must be a full-access API key (e.g. service_role key).
     */
    deleteUser(uid, jwt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fetch_1.remove(`${this.url}/admin/users/${uid}`, {}, {
                    headers: this._createRequestHeaders(jwt),
                });
                return { user: data, data, error: null };
            }
            catch (error) {
                return { user: null, data: null, error };
            }
        });
    }
    /**
     * Generates a new JWT.
     * @param refreshToken A valid refresh token that was returned on login.
     */
    refreshAccessToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fetch_1.post(`${this.url}/token?grant_type=refresh_token`, { refresh_token: refreshToken }, { headers: this.headers });
                let session = Object.assign({}, data);
                if (session.expires_in)
                    session.expires_at = helpers_1.expiresAt(data.expires_in);
                return { data: session, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
    /**
     * Set/delete the auth cookie based on the AuthChangeEvent.
     * Works for Next.js & Express (requires cookie-parser middleware).
     */
    setAuthCookie(req, res) {
        if (req.method !== 'POST') {
            res.setHeader('Allow', 'POST');
            res.status(405).end('Method Not Allowed');
        }
        const { event, session } = req.body;
        if (!event)
            throw new Error('Auth event missing!');
        if (event === 'SIGNED_IN') {
            if (!session)
                throw new Error('Auth session missing!');
            cookies_1.setCookie(req, res, {
                name: this.cookieOptions.name,
                value: session.access_token,
                domain: this.cookieOptions.domain,
                maxAge: this.cookieOptions.lifetime,
                path: this.cookieOptions.path,
                sameSite: this.cookieOptions.sameSite,
            });
        }
        if (event === 'SIGNED_OUT')
            cookies_1.deleteCookie(req, res, this.cookieOptions.name);
        res.status(200).json({});
    }
    /**
     * Get user by reading the cookie from the request.
     * Works for Next.js & Express (requires cookie-parser middleware).
     */
    getUserByCookie(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.cookies)
                    throw new Error('Not able to parse cookies! When using Express make sure the cookie-parser middleware is in use!');
                if (!req.cookies[this.cookieOptions.name])
                    throw new Error('No cookie found!');
                const token = req.cookies[this.cookieOptions.name];
                const { user, error } = yield this.getUser(token);
                if (error)
                    throw error;
                return { user, data: user, error: null };
            }
            catch (error) {
                return { user: null, data: null, error };
            }
        });
    }
    /**
     * Generates links to be sent via email or other.
     * @param type The link type ("signup" or "magiclink" or "recovery" or "invite").
     * @param email The user's email.
     * @param password User password. For signup only.
     * @param data Optional user metadata. For signup only.
     * @param redirectTo The link type ("signup" or "magiclink" or "recovery" or "invite").
     */
    generateLink(type, email, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fetch_1.post(`${this.url}/admin/generate_link`, {
                    type,
                    email,
                    password: options.password,
                    data: options.data,
                    redirect_to: options.redirectTo,
                }, { headers: this.headers });
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
}
exports.default = GoTrueApi;
//# sourceMappingURL=GoTrueApi.js.map