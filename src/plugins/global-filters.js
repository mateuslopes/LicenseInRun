// plugins/global-filters.ts
export default {
  install: (app) => {
    function boolText(value, falsyText, truthyText) {
      if (value > 0 || value === true) return truthyText;
      return falsyText;
    }

    function printSelectLabel(rows, value, valKey, labelKey) {
      valKey = valKey || "value";
      labelKey = labelKey || "label";
      const filtered = rows.filter((r) => r[valKey] == value);
      if (filtered.length == 0) return value;
      return filtered[0][labelKey] || value;
    }

    app.config.globalProperties.$filters = {
      boolText: boolText,
      printSelectLabel: printSelectLabel,
    };
  },
};
