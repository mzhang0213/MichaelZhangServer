import { NextResponse } from "next/server";
import {client_id, stateKey} from "@/app/resources/keys";

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length: number): string {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


export async function GET(req: Request) {
    //const body = await req.json();

    //const shortUrl = req.url.substring(req.url.indexOf("?")+1);
    //const parsedQuery = querystring.parse(shortUrl) as {playlistInfo:string};
    //lastPlaylist=parsedQuery.playlistInfo;

    const state = generateRandomString(16);

    // your application requests authorization
    const scope = "playlist-read-private";
    const url = new URL(req.url);
    const redirURL = new URL("https://accounts.spotify.com/authorize?");
    redirURL.search = new URLSearchParams({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: url.origin+"/spotifyYt/api/callback",
        state: state
    }).toString();

    const res = NextResponse.redirect(redirURL.toString());
    res.cookies.set(stateKey,state);
    return res;
}