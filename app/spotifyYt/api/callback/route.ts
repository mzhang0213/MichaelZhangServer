import { NextResponse } from "next/server";
import querystring from "querystring";
import {client_id, client_secret, stateKey} from "@/app/resources/keys";
import {cookies} from "next/headers";


export async function GET(req: Request) {
    // your application requests refresh and access tokens
    // after checking the state parameter

    const {searchParams} = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const url = new URL(req.url);
    const cookieStoreState = (await cookies()).get(stateKey);
    let storedState;

    if (cookieStoreState==undefined){
        storedState = null;
    }else{
        storedState = cookieStoreState.value;
    }

    if (state === null || state !== storedState) {
        const res = NextResponse.redirect(url.origin+"/spotifyYt/#" +
            querystring.stringify({
                error: "state_mismatch"
            }));
        res.headers.set("Set-Cookie", `${stateKey}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`);
        return res;
    } else {
        const request = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Authorization": "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
                "content-type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                code: code || "",
                redirect_uri: url.origin + "/spotifyYt/api/callback",
                grant_type: "authorization_code"
            })
        });
        if (request.ok){
            const body = await request.json();
            const access_token = body.access_token;
            const refresh_token = body.refresh_token;

            const res = NextResponse.redirect(url.origin+"/spotifyYt/app.html?" +
                new URLSearchParams({
                    access_token: access_token,
                    refresh_token: refresh_token,
                    //playlistInfo: lastPlaylist
                })
            );
            res.headers.set("Set-Cookie", `${stateKey}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`);
            return res;
        }else{
            const res = NextResponse.redirect(url.origin+"/spotifyYt/?" +
                new URLSearchParams({
                    error: "invalid_token"
                }));
            res.headers.set("Set-Cookie", `${stateKey}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`);
            return res;
        }
    }
}