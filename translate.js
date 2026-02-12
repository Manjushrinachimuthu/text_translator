document.addEventListener("DOMContentLoaded", () => {

  // ---------- Indian Translator ----------
  const inputIndian = document.getElementById("inputTextIndian");
  const targetIndian = document.getElementById("targetLanguageIndian");
  const translateBtnIndian = document.getElementById("translateBtnIndian");
  const translatedIndian = document.getElementById("translatedTextIndian");
  const charCountIndian = document.getElementById("charCountIndian");

  inputIndian.addEventListener("input", () => {
    charCountIndian.textContent = `${inputIndian.value.length} characters`;
  });

  translateBtnIndian.addEventListener("click", async () => {
    const text = inputIndian.value.trim();
    const targetLang = targetIndian.value;

    if (!text || !targetLang) {
      alert("Please enter text and select a target language.");
      return;
    }

    translatedIndian.textContent = "Translating...";

    try {
      const response = await fetch("http://127.0.0.1:5000/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang })
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      translatedIndian.textContent = data.translatedText || "Translation unavailable.";

      // ✅ Save to History (FIXED ONLY THIS PART)
      const username = localStorage.getItem("username");
      const email = localStorage.getItem("email");

      if (username && email && data.translatedText) {
        await fetch("http://localhost:3000/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            email: email,
            input_text: text,
            translated_text: data.translatedText,
            source_language: "English",
            target_language: targetLang
          })
        });
      }

    } catch (err) {
      console.error(err);
      translatedIndian.textContent = "Error fetching translation. Please try again later.";
    }
  });


  // ---------- Non-Indian Translator ----------
  const inputOther = document.getElementById("inputTextOther");
  const targetOther = document.getElementById("targetLanguageOther");
  
  const translateBtnOther = document.getElementById("translateBtnOther");
  const translatedOther = document.getElementById("translatedTextOther");
  const charCountOther = document.getElementById("charCountOther");

 

 

  inputOther.addEventListener("input", () => {
    charCountOther.textContent = `${inputOther.value.length} characters`;
  });

  translateBtnOther.addEventListener("click", async () => {
    const text = inputOther.value.trim();
    const targetLang = targetOther.value;
  
    if (!text || !targetLang) {
      alert("Please enter text and select a target language.");
      return;
    }

    translatedOther.textContent = "Translating...";

    try {
      const response = await fetch("http://127.0.0.1:5000/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang, targetDialect: dialect || null })
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      translatedOther.textContent = data.translatedText || "Translation unavailable.";

      // ✅ Save to History (FIXED ONLY THIS PART)
      const username = localStorage.getItem("username");
      const email = localStorage.getItem("email");

      if (username && email && data.translatedText) {
        await fetch("http://localhost:3000/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            email: email,
            input_text: text,
            translated_text: data.translatedText,
            source_language: "English",
            target_language: targetLang
          })
        });
      }

    } catch (err) {
      console.error(err);
      translatedOther.textContent = "Error fetching translation. Please try again later.";
    }
  });

});
