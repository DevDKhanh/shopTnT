function ajaxCall({
    method = 'GET',
    url = '',
    success = () => {},
    error = () => {},
}) {
    const xhttp = new XMLHttpRequest();
    console.log(xhttp);
    xhttp.open(method, url, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                success(this.responseText);
            } else {
                error(this.statusText);
            }
        }
    };
}
