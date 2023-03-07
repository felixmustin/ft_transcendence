
function formtostr (form){
	const formData = new FormData(form);
    let formDataText = "";
    formData.forEach((value, key) => formDataText += key + "=" + value + "&");
    formDataText = formDataText.substring(0, formDataText.length - 1);
	return formDataText;
}

export default formtostr;