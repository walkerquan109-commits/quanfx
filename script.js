let ws;
let licenseValid = false;

function log(msg) {
    document.getElementById("log").textContent += msg + "\n";
}

// LICENSE CHECK
function checkLicense() {
    const licenseKey = document.getElementById("license").value;

    fetch("http://localhost:3000/verify-license", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ licenseKey })
    })
    .then(res => res.json())
    .then(data => {
        if (data.valid) {
            licenseValid = true;
            document.getElementById("startBtn").disabled = false;
            log("✅ License verified");
        } else {
            log("❌ License failed: " + data.reason);
        }
    })
    .catch(() => {
        log("❌ License server not running");
    });
}

// CONNECT TO DERIV
function connect() {
    const token = document.getElementById("token").value;

    ws = new WebSocket("wss://ws.derivws.com/websockets/v3?app_id=1089");

    ws.onopen = () => {
        log("Connected to Deriv");
        ws.send(JSON.stringify({ authorize: token }));
    };

    ws.onmessage = (msg) => {
        log(msg.data);
    };
}

// START BOT
function startBot() {
    if (!licenseValid) {
        log("❌ License not verified");
        return;
    }

    connect();

    const symbol = document.getElementById("symbol").value;

    setTimeout(() => {
        ws.send(JSON.stringify({
            buy: 1,
            price: 1,
            parameters: {
                amount: 1,
                basis: "stake",
                contract_type: "CALL",
                currency: "USD",
                duration: 5,
                duration_unit: "t",
                symbol: symbol
            }
        }));
        log("📈 Trade sent");
    }, 2000);
}
