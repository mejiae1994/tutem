export const getFormData = (formInput) => {
  const formData = new FormData(formInput);
  return Object.fromEntries(formData.entries());
};
