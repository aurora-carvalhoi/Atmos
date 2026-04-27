function mostrarErro(mensagem) {
  const anterior = document.getElementById("atmos-popup-erro");
  if (anterior) anterior.remove();

  document.body.insertAdjacentHTML(
    "beforeend",
    `
        <div id="atmos-popup-erro" style="
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.55);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-family: 'Barlow', sans-serif;
        ">
            <div style="
                background: #0f1b2d;
                border: 1px solid #db3232;
                border-radius: 12px;
                padding: 32px 28px;
                max-width: 420px;
                width: 90%;
                text-align: center;
                box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            ">
                <div style="
                    width: 52px; height: 52px;
                    background: rgba(219,50,50,0.15);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px auto;
                    font-size: 1.5rem;
                    color: #db3232;
                ">✕</div>

                <h3 style="color: #ff6b6b; font-size: 1.1rem; margin-bottom: 10px;">
                    Ocorreu um erro
                </h3>

                <p style="color: #a0b0cc; font-size: 0.95rem; line-height: 1.5; margin-bottom: 24px;">
                    ${mensagem}
                </p>

                <button onclick="document.getElementById('atmos-popup-erro').remove()" style="
                    background: #db3232;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    padding: 10px 32px;
                    font-size: 0.95rem;
                    font-family: 'Barlow', sans-serif;
                    font-weight: 600;
                    cursor: pointer;
                ">Fechar</button>
            </div>
        </div>
    `,
  );
}

function mostrarSucesso(mensagem) {
  const anterior = document.getElementById("atmos-popup-sucesso");
  if (anterior) anterior.remove();

  document.body.insertAdjacentHTML(
    "beforeend",
    `
        <div id="atmos-popup-sucesso" style="
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.55);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-family: 'Barlow', sans-serif;
        ">
            <div style="
                background: #0f1b2d;
                border: 1px solid #00c951;
                border-radius: 12px;
                padding: 32px 28px;
                max-width: 420px;
                width: 90%;
                text-align: center;
                box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            ">
                <div style="
                    width: 52px; height: 52px;
                    background: rgba(0,201,81,0.15);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px auto;
                    font-size: 1.5rem;
                    color: #00c951;
                ">✓</div>
 
                <h3 style="color: #00e85c; font-size: 1.1rem; margin-bottom: 10px;">
                    Sucesso!
                </h3>
 
                <p style="color: #a0b0cc; font-size: 0.95rem; line-height: 1.5;">
                    ${mensagem}
                </p>
            </div>
        </div>
    `,
  );

  
  setTimeout(function () {
    const popup = document.getElementById("atmos-popup-sucesso");
    if (popup) popup.remove();
  }, 2500);
}

function mostrarErroDash(mensagem) {
  const anterior = document.getElementById("atmos-popup-erro");
  if (anterior) anterior.remove();

  document.body.insertAdjacentHTML(
    "beforeend",
    `
        <div id="atmos-popup-erro" style="
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.55);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-family: 'Barlow', sans-serif;
        ">
            <div style="
                background: white;
                border: 1px solid #db3232;
                border-radius: 12px;
                padding: 32px 28px;
                max-width: 420px;
                width: 90%;
                text-align: center;
                box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            ">
                <div style="
                    width: 52px; height: 52px;
                    background: rgba(219,50,50,0.15);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px auto;
                    font-size: 1.5rem;
                    color: #db3232;
                ">✕</div>

                <h3 style="color: #ff6b6b; font-size: 1.1rem; margin-bottom: 10px;">
                    Ocorreu um erro
                </h3>

                <p style="color: black; font-size: 0.95rem; line-height: 1.5; margin-bottom: 24px;">
                    ${mensagem}
                </p>

                <button onclick="document.getElementById('atmos-popup-erro').remove()" style="
                    background: #db3232;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    padding: 10px 32px;
                    font-size: 0.95rem;
                    font-family: 'Barlow', sans-serif;
                    font-weight: 600;
                    cursor: pointer;
                ">Fechar</button>
            </div>
        </div>
    `,
  );
}

function mostrarSucessoDash(mensagem) {
  const anterior = document.getElementById("atmos-popup-sucesso");
  if (anterior) anterior.remove();

  document.body.insertAdjacentHTML(
    "beforeend",
    `
        <div id="atmos-popup-sucesso" style="
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.55);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-family: 'Barlow', sans-serif;
        ">
            <div style="
                background: white;
                border: 1px solid #00c951;
                border-radius: 12px;
                padding: 32px 28px;
                max-width: 420px;
                width: 90%;
                text-align: center;
                box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            ">
                <div style="
                    width: 52px; height: 52px;
                    background: rgba(0,201,81,0.15);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px auto;
                    font-size: 1.5rem;
                    color: #00c951;
                ">✓</div>
 
                <h3 style="color: #00e85c; font-size: 1.1rem; margin-bottom: 10px;">
                    Sucesso!
                </h3>
 
                <p style="color: #000000; font-size: 0.95rem; line-height: 1.5;">
                    ${mensagem}
                </p>
            </div>
        </div>
    `,
  );

  
  setTimeout(function () {
    const popup = document.getElementById("atmos-popup-sucesso");
    if (popup) popup.remove();
  }, 2500);
}