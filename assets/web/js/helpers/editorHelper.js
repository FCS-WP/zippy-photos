export const photoSizes = [
  { id: 1, name: `2.17" x 2.95" (2R)`, price: 1.5, widthIn: 2.17, heightIn: 2.95 },
  { id: 2, name: `3” x 3” (3Q)`, price: 1.5, widthIn: 3.0, heightIn: 3.0 },
  { id: 3, name: `3.5" x 5" (3R)`, price: 0.4, widthIn: 3.5, heightIn: 5.0 },
  { id: 4, name: `4" x 6" (4R)`, price: 0.4, widthIn: 4.0, heightIn: 6.0 },
  { id: 5, name: `5" x 7" (5R)`, price: 1.5, widthIn: 5.0, heightIn: 7.0 },
  { id: 6, name: `6" x 8" (6R)`, price: 2.5, widthIn: 6.0, heightIn: 8.0 },
  { id: 7, name: `8" x 10" (8R)`, price: 6.0, widthIn: 8.0, heightIn: 10.0 },
  { id: 8, name: `8" x 12" (S8R) `, price: 8.0, widthIn: 8.0, heightIn: 12.0 },
  { id: 9, name: `10" x 12" (10R)`, price: 15.0, widthIn: 10.0, heightIn: 12.0 },
  { id: 10, name: `10" x 15" (S10R)`, price: 20.0, widthIn: 10.0, heightIn: 15.0 },
  { id: 11, name: `11" x 14" (11R)`, price: 21.0, widthIn: 11.0, heightIn: 14.0 },
  { id: 12, name: `12" x 16" (12R)`, price: 22.0, widthIn: 12.0, heightIn: 16.0 },
  { id: 13, name: `12" x 18" (S12R)`, price: 23.0, widthIn: 12.0, heightIn: 18.0 },
  { id: 14, name: `8.3" x 11.7" (A4)`, price: 10.0, widthIn: 8.3, heightIn: 11.7 },
  { id: 15, name: `16.5" x 11.7" (A3)`, price: 25.0, widthIn: 16.5, heightIn: 11.7 },
];

export const DPI = 100;

export const inchToPx = (inch) => {
  return inch * DPI;
}