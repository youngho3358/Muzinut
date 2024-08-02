import React from "react";

const Font = {
  whitelist: ["esamanruLight", "esamanruMedium", "esamanruBold"],
};

const Size = {
  whitelist: ["13px", "16px", "18px", "24px", "28px", "32px"],
};

const fontLabels: Record<string, string> = {
  esamanruLight: "동글",
  esamanruMedium: "통통",
  esamanruBold: "뚱뚱",
};

const QuillToolbar = () => {
  return (
    <div>
      <div id="toolbar">
        <span className="ql-formats">
          <select className="ql-font" defaultValue="esamanruLight">
            {Font.whitelist.map((fontOption) => (
              <option key={fontOption} value={fontOption}>
                {fontLabels[fontOption]}
              </option>
            ))}
          </select>

          <select className="ql-size" defaultValue="13px">
            {Size.whitelist.map((sizeOption) => (
              <option key={sizeOption} value={sizeOption}>
                {sizeOption}
              </option>
            ))}
          </select>
        </span>

        <span className="ql-formats">
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button className="ql-strike" />
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
        </span>
        <span className="ql-formats">
          <select className="ql-color" />
          <select className="ql-background" />
        </span>
        <span className="ql-formats">
          <button className="ql-image" />
        </span>
      </div>
    </div>
  );
};

export default QuillToolbar;
