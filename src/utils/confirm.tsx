import Swal from "sweetalert2";

export const confirmDelete = async (
    title = "Are you sure?",
    text = "Data cannot be restored!",
    confirmButtonText = "Yes, Delete!"
): Promise<boolean> => {
    const result = await Swal.fire({
        title,
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#aaa",
        confirmButtonText: confirmButtonText,
    });

    return result.isConfirmed;
};

export const confirm = async (
    title = "",
    text = "",
    confirmButtonText = ""
): Promise<boolean> => {
    const result = await Swal.fire({
        title,
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#aaa",
        confirmButtonText: confirmButtonText,
    });

    return result.isConfirmed;
};
