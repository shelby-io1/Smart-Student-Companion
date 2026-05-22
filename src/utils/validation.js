export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateNote = (title, description) => {
  const errors = {};
  if (!title.trim()) errors.title = 'Title is required';
  if (!description.trim()) errors.description = 'Description is required';
  return errors;
};
