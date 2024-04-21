export function getErrorMessageJSON(message: string) {
  return {
    error: {
      type: "error",
      code: "error",
      message,
      param: null,
    },
  };
}
