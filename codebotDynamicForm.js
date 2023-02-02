document.getElementById("request").addEventListener("change", questionTypeFormChanging);

function questionTypeFormChanging(){
    console.log('questionTypeFormChanging triggered...');
    let languageSelectDiv = document.getElementById("languageSelectDiv");
    let languageInputSelect = document.getElementById("language");
    let familiaritySelectDiv = document.getElementById("familiaritySelectDiv");
    let csFamiliarity = document.getElementById("csFamiliarity");

    let questionTypeSelected = document.getElementById("request").value;
    switch (questionTypeSelected) {
        case "ideationRequest":
        case "researchRequest":
        case "planningRequest":
        case "ccReflectionRequest":
            setFormOptions(questionTypeSelected);
            languageSelectDiv.style.display = 'none';
            languageInputSelect.value = "in general";
            familiaritySelectDiv.style.display = 'none';
            csFamiliarity.value = "I have some experience";
            break;

        case "databaseRequest":
            setFormOptions(questionTypeSelected);
            languageSelectDiv.style.display = 'block';
            languageInputSelect.value = "SQL";
            familiaritySelectDiv.style.display = 'block';
            csFamiliarity.value = "I have some experience";
            break;

        case "csConceptRequest":
        case "codeRequest":
        case "dataRequest":
        case "explainCodeRequest":
        case "debugRequest":
        case "codeImprovementRequest":
            setFormOptions(questionTypeSelected);
            languageSelectDiv.style.display = 'block';
            languageInputSelect.value = "Python";
            familiaritySelectDiv.style.display = 'block';
            csFamiliarity.value = "I have some experience";
            break;

        case "codeTransformationToPython":
            setFormOptions(questionTypeSelected);
            languageSelectDiv.style.display = 'block';
            languageInputSelect.value = "JavaScript";
            familiaritySelectDiv.style.display = 'block';
            csFamiliarity.value = "I have some experience";
            break;

        default:
            setFormOptions('default');
            languageSelectDiv.style.display = 'none';
            languageInputSelect.value = "in general";
            familiaritySelectDiv.style.display = 'none';
            csFamiliarity.value = "I have some experience";
    }
    document.getElementById("codeInput").value = "";
    dynamicPrompt();
}

function setFormOptions(mode){
    console.log('form reset to:', mode);
    let languageInputSelect = document.getElementById("language").value;
    let csFamiliarity = document.getElementById("csFamiliarity").value;
    console.log('languageSelectVal', languageInputSelect, 'csFamiliarity', csFamiliarity);
}

questionTypeFormChanging();
