(function(){
    const lSelect = document.getElementById('lSelect');
    const lTextarea = document.getElementById('lTextarea');

    const eTextArea = document.getElementById('eTextarea');

    const yTextarea =  document.getElementById('yTextarea');

    const translateBtn = document.getElementById('translateBtn');

    var apiHelper = (function(){
        const KEY = 'trnsl.1.1.20210510T202220Z.42af84fb54a299ad.f7606096f8122f4707441367c418accfe3d80f07';
        const FROM = 'ro';
        const TO = 'en'; // default target language
    
        const yandexTranslateOrigin = 'https://translate.yandex.net';
        const yandexBaseAPI = `${yandexTranslateOrigin}/api/v1.5/tr.json`;

        const funnyTranslateOrigin = "https://api.funtranslations.com";
        const funnyBaseApi= `${funnyTranslateOrigin}/translate`;
        const funnyKey = "5wvsbpIXJ4L4rqzyQCL0ZgeF"
    
        // to prevent cors in the browser
        const withCors = (url) => `https://cors-anywhere.herokuapp.com/${url}`; 
    
        function encodeURI(data){
            return "?" + Object.keys(data).map(
                function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
            ).join('&')
        }
    
        async function callApi(type, req, success) {
            var url = req.params ? req.url + encodeURI(req.params) : req.url;
            const response = await fetch(url, {
                method: type,
                headers: req.headers
            });
            const responseData = await response.json();
            success(responseData);
        }
    
        function getSupportedLang(callback){
            var req = {
                url: yandexBaseAPI + '/getLangs',
                params: {
                    key: KEY,
                    ui: FROM
                },
                headers: {
                    Origin: yandexTranslateOrigin
                }
            }
    
            callApi("GET", req, response => {
                callback(response)
            })
        }

        function translateToEnglish(callback){
            var from = lSelect.value
            var sourceText = lTextarea.value;

            var req = {
                url: yandexBaseAPI + "/translate",
                params: {
                    key: KEY,
                    lang: from + "-" + TO,
                    text: sourceText
                },
                headers: {
                    Origin: yandexTranslateOrigin
                }
            }
    
            callApi("GET", req, response => {
                const text = response.text[0];
                callback(text)
            })
        }

        function funnyTranslate(type, text, callback){
            var req = {
                url: funnyBaseApi + "/dothraki.json",
                headers: {
                    'X-Funtranslations-Api-Secret': funnyKey,
                    Origin: funnyTranslateOrigin
                },
                params: {
                    text: text,
                }
            }
    
            callApi("GET", req, response => {
                callback(response)
            })
        }
    
        return {
            getSupportedLang,
            translateToEnglish,
            funnyTranslate
        }
    }())

    apiHelper.getSupportedLang(response => {
        const langs = response.langs;     

debugger;

        for (var key in langs) {
            if (langs.hasOwnProperty(key)) {
                var el = document.createElement("option");
                el.textContent = langs[key];
                el.value = key;
                if(key === "ro"){
                    el.selected = true;
                }
                lSelect.appendChild(el);
            }
        }

        uiCustomSelect.init(lSelect.parentNode);
    })

    translateBtn.addEventListener('click', () => {
        apiHelper.translateToEnglish(response => {
            eTextArea.textContent = response;

            apiHelper.funnyTranslate("dothraki", response, fResponse => {
                yTextarea.textContent = fResponse.contents.translated;
            })
        })
    })
}())