
const ApiCall = async ({ url, path, method = 'GET', data = {}, token, router, contentType = null, headers = {}, ...params }) => {
    let api;
    let options = {
        method: method,
        headers: { ...headers },
        ...params
    };
    try {
        api = await fetch(`http://localhost:4000/${path}`, options)
    } catch (e) {
        api = e.response;
    }

    if (api.ok) {
        return api.json();
    }
    else {
        return api.json().then(json => Promise.reject(json))
    }
    return api;
}

const getPaymentResult = async (id) => {
    let { data } = await ApiCall({
        path: 'get-payment',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            session: [ { id: id } ]
        })
    })

    return data;
}

const getPaymentDetail = async (id) => {
    console.log(id)
    let { data } = await ApiCall({
        path: 'get-payment-detail',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            payment: [ { id: id } ]
        })
    })

    return data;
}

export { getPaymentResult, getPaymentDetail };