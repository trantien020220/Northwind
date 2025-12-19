export const handleBackendValidation = (err, setErrors, fallbackMessage = "Action failed") => {
    const responseErrors = err.response?.data?.errors;

    if (!responseErrors) {
        alert(fallbackMessage);
        return;
    }

    if (!setErrors) {
        alert(Object.values(responseErrors)[0][0]);
        return;
    }

    const formattedErrors = {};
    Object.keys(responseErrors).forEach(key => {
        formattedErrors[key.charAt(0).toLowerCase() + key.slice(1)] =
            responseErrors[key][0];
    });

    setErrors(formattedErrors);
};


// export const handleBackendValidation = (err, setErrors, fallbackMessage = "Save failed") => {
//     const responseErrors = err.response?.data?.errors;
//
//     if (!responseErrors) {
//         alert(fallbackMessage);
//         return;
//     }
//
//     const formattedErrors = {};
//
//     Object.keys(responseErrors).forEach((key) => {
//         // Ví dụ: ProductName -> productName
//         const formattedKey =
//             key.charAt(0).toLowerCase() + key.slice(1);
//
//         formattedErrors[formattedKey] = responseErrors[key][0];
//     });
//
//     setErrors(formattedErrors);
// };