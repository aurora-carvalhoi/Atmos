// Api do openWeather
const apiKey = "3c190b2fa5f085039929c9b8261e066b"
const cityName = 'são paulo';

// getOpenWeather();
// previsaoSeisDias()

async function getOpenWeather() {
    const url_api = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=pt-br`;
    try {
        let results = await fetch(url_api);
        let json = await results.json();
        console.log("getOpenWeather");
        console.log(json);
        return json
    } catch (error) {
        console.error("Erro na requisição: ", error)
    }
}


async function previsaoSeisDias() {
    let cnt = 48;
    // let url_api_seisDias = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&cnt=${cnt}&appid=${apiKey}&units=metric&lang=pt-br`;
    // let url_api_seisDias = `https://api.openwe athermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric&lang=pt-br`;
    let url_api_seisDias = `https://api.openweathermap.org/data/3.0/onecall?lat=-23.55&lon=-46.63&exclude=minutely,daily&appid=${apiKey}&units=metric&lang=pt_br`;
    try {
        let results = await fetch(url_api_seisDias);
        let json = await results.json();
        const previsoesPorDia = json.list.filter(previsao => previsao.dt_txt.includes("12:00:00"));
        console.log(previsoesPorDia);
        return previsoesPorDia
    } catch (error) {
        console.error("Erro na requisição:", error);
    }
}
