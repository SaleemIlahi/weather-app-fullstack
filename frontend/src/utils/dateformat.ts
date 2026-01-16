export const dateformat = (
    dt: number,
    options: Intl.DateTimeFormatOptions
  ): string => {
    const date = new Date((dt) * 1000);

    const formatOptions = options;
  
    return date.toLocaleString('en-IN', formatOptions).replace(/\//g, "-");;
  }