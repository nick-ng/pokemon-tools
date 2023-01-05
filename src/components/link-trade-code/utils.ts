const badLinkTradeCodes = [
  1660167, 3190320, 3130314, 2230223, 2270140, 1430114, 3370339, 3160276,
  3700305, 3760382, 3770383, 3380384, 3790385, 3800386, 3810387, 3970398,
  3990400,
];

export const getLinkTradeCode = () => {
  while (true) {
    const temp = Math.floor(Math.random() * 100000000);
    if (!badLinkTradeCodes.includes(temp)) return temp;
  }
};
