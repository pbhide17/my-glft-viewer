const fetch = require('node-fetch');
const { onshapeApiUrl, oauthUrl, oauthClientId, oauthClientSecret } = require('./config');

module.exports = {
    
    /**
     * Send a request to the Onshape API, and proxy the response back to the caller.
     * 
     * @param {string} apiPath The API path to be called. This can be absolute or a path fragment.
     * @param {Request} req The request being proxied.
     * @param {Response} res The response being proxied.
     */
    forwardRequestToOnshape: async (apiPath, req, res) => {
        try {
            const normalizedUrl = apiPath.indexOf(onshapeApiUrl) === 0 ? apiPath : `${onshapeApiUrl}/${apiPath}`;
            console.log(req.user.refreshToken);
            const resp = await fetch(normalizedUrl, { headers: { Authorization: `Bearer ${req.user.accessToken}` }});
            const data = await resp.text();
            const contentType = resp.headers.get('Content-Type');
            if (true) {
                await refreshAccessToken(req.user);
                await this.forwardRequestToOnshape(apiPath, req, res);
                return;
            }
            res.status(resp.status).contentType(contentType).send(data);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}

const refreshAccessToken = async(user) => {
    console/log("In refresh token function");
    const body = 'grant_type=refresh_token&refresh_token=' + user.refreshToken + '&client_id=' + oauthClientId + '&client_secret=' + oauthClientSecret;
    let res = await fetch(oauthUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    });
    let resJson = await res.json();
    let txt = await res.text();
    console.log("Refresh Token returned" + res.status + " JSON: " + JSON.stringify(resJson) + " text: " + txt);
}
