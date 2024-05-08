import * as Yup from 'yup'
export const createCat = Yup.object({
    catName: Yup.string().min(2).required("Please enter category name"),
    catStatus: Yup.string().required("Please select status")
});

export const subCatSchema = Yup.object({
    catName: Yup.string().required("Please select category name"),
    subCatName: Yup.string().min(2).required("Please enter Sub Category name"),
    subCatDesc: Yup.string().min(2).required("Please enter description"),
    subCatStatus: Yup.string().required("Please select status")
});

export function checkIfFileIsCorrectType(file) {
    if (!file) return false;

    return ['image/jpg', 'image/jpeg', 'image/png'].includes(file.type);
}

export const brandSchema = Yup.object({
    catName: Yup.string().required("Please select category name"),
    subCatName: Yup.string().required("Please enter Sub Category name"),
    brandName: Yup.string().min(2).required("Please enter Brand name"),
    brandStatus: Yup.string().required("Please select status")
});

export const productSchema = Yup.object({
    catName: Yup.string().required("Please select category name"),
    subCatName: Yup.string().required("Please select Sub Category name"),
    brandName: Yup.string().required("Please select Brand name"),
    pro_name: Yup.string().required("Please enter Product name"),
});

export const varSchema = Yup.object({
    var_name: Yup.string().required("Please Enter variation name"),
});

export const loginSchema = Yup.object({
    userEmail: Yup.string().required("Please Enter Email").matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Invalid Email"),
    userPass: Yup.string().required("Please Enter Password")
});

export const changepassSchema = Yup.object({
    user_email: Yup.string().required("Please Enter Email").matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Invalid Email"),
    old_pass: Yup.string().required("Old Password Required"),
    new_pass: Yup.string().required("Please Enter New Password")
        .min(8, "Password should atleast be 8 characters long").max(16, "Password should not be greater than 16 characters")
})

export const forgotPassSchema = Yup.object({
    user_email: Yup.string().required("Please Enter Email").matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Invalid Email"),
    new_pass: Yup.string().required("Please Enter New Password")
        .min(8, "Password should atleast be 8 characters long").max(16, "Password should not be greater than 16 characters")
});