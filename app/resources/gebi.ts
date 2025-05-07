export function gebi (e: string) {
    let el = document.getElementById(e);
    if (el !== null) {
        return el;
    }else{
        throw new Error("no element was able to be obtained");
    }
}