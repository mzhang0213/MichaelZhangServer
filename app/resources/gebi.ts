export function gebi (e: string) {
    const el = document.getElementById(e);
    if (el !== null) {
        return el;
    }else{
        throw new Error("no element was able to be obtained");
    }
}