export function newMockOpts(prefix) {
  const r = Math.random()
    .toString()
    .substr(2, 6);
  return {
    name: prefix + "_" + r,
    title: prefix + "_title_" + r,
    description: prefix + "_description_" + r,
  };
}

export function LicenseDefaults(opts) {
  const c_at = Math.floor(Date.now() / 1000);

  const def = {
    name: "",
    title: "",
    description: "",
    c_id: "",
    c_at: c_at,
    cclb: true,
    trsf: false,
    c_lft: -1,
    //
    p_ad: [["", 1]],
    //
    p_c_max: -1,
    p_c_tu: -1,
    p_c_pr: 546,
    p_c_min: 1,
    //
    pld: {},
    verifiable: false,
  };
  return Object.assign({}, def, opts || {});
}

export function getLicenseOptionsExample(optsKey, purseAddress) {
  const c_at = Math.floor(Date.now() / 1000);
  const r = Math.random()
    .toString()
    .substr(2, 6);
  if (optsKey == "max-lifetime")
    return {
      name: "Timed License",
      title: "Title_" + r,
      description: "Descr_" + r,
      c_id: "Company1",
      c_at: c_at,
      cclb: true,
      trsf: false,
      c_lft: 180,
      //
      p_ad: [[purseAddress, 1.0]],
      p_c_max: -1,
      p_c_tu: 30,
      p_c_pr: 11000,
      p_c_min: 3,
      //
      pld: {
        type: "website_subscription",
        uuid: r,
      },
      verifiable: false,
    };
  else if (optsKey == "max-rounds")
    return {
      name: "Cyclic License",
      title: "T_" + r,
      description: "D_" + r,
      c_id: "Company1",
      c_at: c_at,
      cclb: false,
      trsf: true,
      c_lft: -1,
      //
      p_ad: [[purseAddress, 1.0]],
      p_c_max: 12,
      p_c_tu: 20,
      p_c_pr: 2500,
      p_c_min: 7,
      //
      pld: {
        type: "maximum time with me",
        uuid: r,
      },
      verifiable: false,
    };
  else if (optsKey == "unlimited")
    return {
      name: "Unlimited License",
      title: "T_" + r,
      description: "D_" + r,
      c_id: "Company1",
      c_at: c_at,
      cclb: true,
      trsf: true,
      c_lft: -1,
      //
      p_ad: [[purseAddress, 1.0]],
      p_c_max: -1,
      p_c_tu: 15,
      p_c_pr: 2500,
      p_c_min: 1,
      //
      pld: {
        type: "unlimited contract",
        uuid: r,
      },
      verifiable: false,
    };

  return LicenseDefaults();
}
