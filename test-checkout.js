const fetch = require("node-fetch");

async function run() {
  try {
    const res = await fetch("http://localhost:3000/api/payment/card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 40,
        items: [],
        customer: { name: "Teste", email: "t@t.com", phone: "11999999999", document: "11111111111" },
        shipping: { name: "Teste", street: "Rua", number: "1", neighborhood: "Bairro", city: "Sao Paulo", state: "SP", zipCode: "00000000" },
        card: { holder: "TESTE", number: "1111222233334444", expiry: "12/30", cvv: "123" }
      })
    });
    console.log(res.status);
    const text = await res.text();
    console.log(text);
  } catch (e) {
    console.error(e);
  }
}
run();
