import { NextResponse } from 'next/server';
import client from "@/app/resources/mongodb";
import querystring from "querystring";
import {client_id} from "@/app/spotifyYt/api/keys";

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length: number): string {
    let text = "";
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export const stateKey = 'spotify_auth_state';

export let lastPlaylist = "";

export async function GET(req: Request) {
    const body = await req.json();

    const shortUrl = req.url.substring(req.url.indexOf("?")+1);
    const parsedQuery = querystring.parse(shortUrl) as {playlistInfo:string};
    lastPlaylist=parsedQuery.playlistInfo;

    const state = generateRandomString(16);

    // your application requests authorization
    const scope = 'playlist-read-private';
    const origin = new URL(req.url).origin;
    const redirURL = new URL("https://accounts.spotify.com/authorize?");
    redirURL.search = querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: origin+'/spotifyYt/callback',
        state: state
    });

    const res = NextResponse.redirect(redirURL.toString());
    res.cookies.set(stateKey,state);
    return res;
}