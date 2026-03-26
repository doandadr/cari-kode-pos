document.getElementById("submit").addEventListener("click", function (event) {
    event.preventDefault();
});

const query = document.getElementById("query")
const output = document.getElementById("output")

const debounce = (fn, delay) => {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn(...args), delay)
    }
}

const getResult = async () => {    
    const response = await fetch(
        `https://kodepos.vercel.app/search?q=${query.value}`
    )

    const data = await response.json()
    return data
}

const getMatched = (item) => {
    let res = []

    for (let name in item) {
        if (item[name] !== null && String(item[name]).toLowerCase().includes(query.value.toLowerCase())) 
        {
            let category = {
                'province': 'Provinsi',
                'regency': 'Kabupaten/Kota',
                'district': 'Kecamatan',
                'village': 'Desa/Kelurahan',
                'code': 'Kode Pos'
            }

            if (category[name]) {
                res = [category[name], item[name]]
            }
        }
    }

    return res
}

const handleCopy = (text) => {
  navigator.clipboard.writeText(text);

  alert("Kode pos " + text + " telah ter-copy");
} 

const displayResult = async () => {
    let result = await getResult()
    
    if (result.statusCode !== 200 || !result.data || result.data.length === 0) {
        output.innerHTML = "Maaf, tidak dapat ditemukan hasil pencarian"
        return
    }

    let items = result.data.map((item) => {
        let matched = getMatched(item)
        return `<div onclick="handleCopy('${item.code}')" class="item">
                    <p>${matched ? matched[0] : ''}</p>
                    <h3>${matched ? matched[1] : ''}</h3>
                    <p>Provinsi: ${item.province}
                        <br>
                        Kota/Kab: ${item.regency}
                        <br>
                        Kecamatan: ${item.district}
                        <br>
                        Kelurahan: ${item.village}
                    </p>
                    <h3>${item.code}</h3>
                </div>`
    })

    output.innerHTML = items.join('')
}

const debouncedDisplayResult = debounce(() => displayResult(), 400)

const handleSubmit = () => {
    output.innerHTML = "mohon tunggu..."
    debouncedDisplayResult()
}