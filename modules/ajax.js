
export let ajaxGET = async function (url, responseType, header) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        switch (responseType) {
            case "text":
                break;
            case "document":
                break;
            case "json":
                break;
            default:
                reject("responseType is not valid");
        }
        xhr.responseType = responseType;

        xhr.addEventListener("readystatechange", function (e) {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                const status = xhr.status;
                if (status === 0 || (status >= 200 && status < 400)) {

                    resolve(xhr.response);
                } else {
                    reject("ajaxGET error");
                }
            }
        });
        xhr.open("GET", url, true);
        xhr.setRequestHeader(header[0], header[1]);
        xhr.send();
    });
}

export let ajaxPOST = async function (url, post) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        xhr.open('POST', url, true)
        xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
        xhr.send(JSON.stringify(post));
        xhr.onload = function () {
            if (xhr.status === 201) {
                resolve("Post successfully created!")
            }
        }
    });
};
