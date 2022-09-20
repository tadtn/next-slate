import isHotkey from "is-hotkey";
import isUrl from "is-url";
import React from "react";
import {
  createEditor,
  Descendant,
  Editor,
  Element as SlateElement,
  Range,
  Transforms,
} from "slate";
import { withHistory } from "slate-history";
import { jsx } from "slate-hyperscript";
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useFocused,
  useSelected,
  useSlate,
  useSlateStatic,
  withReact,
} from "slate-react";
import {
  BlockType,
  CustomEditor,
  CustomElement,
  CustomElementType,
  MarkType,
} from "../../custom-type";
import imageExtensions from "image-extensions";

const ELEMENT_TAGS: any = {
  A: (el: any) => ({ type: "link", url: el.getAttribute("href") }),
  BLOCKQUOTE: () => ({ type: "quote" }),
  H1: () => ({ type: "heading-one" }),
  H2: () => ({ type: "heading-two" }),
  H3: () => ({ type: "heading-three" }),
  H4: () => ({ type: "heading-four" }),
  H5: () => ({ type: "heading-five" }),
  H6: () => ({ type: "heading-six" }),
  IMG: (el: any) => ({ type: "image", url: el.getAttribute("src") }),
  LI: () => ({ type: "list-item" }),
  OL: () => ({ type: "numbered-list" }),
  P: () => ({ type: "paragraph" }),
  PRE: () => ({ type: "code" }),
  UL: () => ({ type: "bulleted-list" }),
};

const TEXT_TAGS: any = {
  CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underline: true }),
};

type HotKeys = {
  [key: string]: MarkType;
};

const HOTKEYS: HotKeys = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES: CustomElementType[] = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES: CustomElementType[] = [
  "left",
  "center",
  "right",
  "justify",
];

const SlateEditor: React.FC = () => {
  const [value, setValue] = React.useState<Descendant[]>([
    {
      type: "paragraph",
      children: [
        { text: "This is editable " },
        { text: "rich", bold: true },
        { text: " text, " },
        { text: "much", italic: true },
        { text: " better than a " },
        { text: "<textarea>", code: true },
        { text: "!" },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "Since it's rich text, you can do things like turn a selection of text ",
        },
        { text: "bold", bold: true },
        {
          text: ", or add a semantically rendered block quote in the middle of the page, like this:",
        },
      ],
    },
    {
      type: "block-quote",
      children: [{ text: "A wise quote." }],
    },
    {
      type: "paragraph",
      align: "center",
      children: [{ text: "Try it out for yourself!" }],
    },
  ]);

  const renderElement = React.useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = React.useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );
  const editor = React.useMemo<CustomEditor>(
    () =>
      withHtml(withImages(withLink(withHistory(withReact(createEditor()))))),
    []
  );

  const handleChange = React.useCallback((value: Descendant[]) => {
    setValue(value);
  }, []);

  const markList = React.useMemo(
    () => [
      {
        format: "bold",
        render: (active: boolean) => (
          <button style={{ color: active ? "red" : "blue" }}>{`Bold`}</button>
        ),
      },
      {
        format: "italic",
        render: (active: boolean) => (
          <button style={{ color: active ? "red" : "blue" }}>{`Italic`}</button>
        ),
      },
      {
        format: "underline",
        render: (active: boolean) => (
          <button
            style={{ color: active ? "red" : "blue" }}
          >{`Underline`}</button>
        ),
      },
      {
        format: "code",
        render: (active: boolean) => (
          <button style={{ color: active ? "red" : "blue" }}>{`Code`}</button>
        ),
      },
      {
        format: "strikethrough",
        render: (active: boolean) => (
          <button
            style={{ color: active ? "red" : "blue" }}
          >{`Strikethrough`}</button>
        ),
      },
    ],
    []
  );

  const blockList = React.useMemo(
    () => [
      {
        format: "paragraph",
        render: (active: boolean) => (
          <button
            style={{ color: active ? "red" : "blue" }}
          >{`Paragraph`}</button>
        ),
      },
      {
        format: "heading-one",
        render: (active: boolean) => (
          <button
            style={{ color: active ? "red" : "blue" }}
          >{`Heading-one`}</button>
        ),
      },
      {
        format: "heading-two",
        render: (active: boolean) => (
          <button
            style={{ color: active ? "red" : "blue" }}
          >{`Heading-two`}</button>
        ),
      },
      {
        format: "block-quote",
        render: (active: boolean) => (
          <button
            style={{ color: active ? "red" : "blue" }}
          >{`Block-quote`}</button>
        ),
      },
      {
        format: "numbered-list",
        render: (active: boolean) => (
          <button
            style={{ color: active ? "red" : "blue" }}
          >{`Numbered-list`}</button>
        ),
      },
      {
        format: "bulleted-list",
        render: (active: boolean) => (
          <button
            style={{ color: active ? "red" : "blue" }}
          >{`Bulleted-list`}</button>
        ),
      },
      {
        format: "list-item",
        render: (active: boolean) => (
          <button
            style={{ color: active ? "red" : "blue" }}
          >{`List-item`}</button>
        ),
      },
      {
        format: "left",
        render: (active: boolean) => (
          <button
            style={{ color: active ? "red" : "blue" }}
          >{`Align-left`}</button>
        ),
      },
      {
        format: "center",
        render: (active: boolean) => (
          <button
            style={{ color: active ? "red" : "blue" }}
          >{`Align-center`}</button>
        ),
      },
      {
        format: "right",
        render: (active: boolean) => (
          <button
            style={{ color: active ? "red" : "blue" }}
          >{`Align-right`}</button>
        ),
      },
      {
        format: "justify",
        render: (active: boolean) => (
          <button
            style={{ color: active ? "red" : "blue" }}
          >{`Align-justify`}</button>
        ),
      },
    ],
    []
  );

  return (
    <Slate editor={editor} value={value} onChange={handleChange}>
      <div>
        {markList.map((item: any, index: number) => (
          <MarkButton key={index} format={item.format} render={item.render} />
        ))}
        {blockList.map((item: any, index: number) => (
          <BlockButton key={index} format={item.format} render={item.render} />
        ))}
        <LinkButton />
        <InsertImageButton />
      </div>
      <Editable
        style={{ border: "1px solid black", marginTop: 14, padding: 20 }}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
};

const Element: React.FC<RenderElementProps> = (props) => {
  const { attributes, children, element } = props;

  const style = { textAlign: element.align };
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case "heading-three":
      return (
        <h3 style={style} {...attributes}>
          {children}
        </h3>
      );
    case "heading-four":
      return (
        <h4 style={style} {...attributes}>
          {children}
        </h4>
      );
    case "heading-five":
      return (
        <h5 style={style} {...attributes}>
          {children}
        </h5>
      );
    case "heading-six":
      return (
        <h6 style={style} {...attributes}>
          {children}
        </h6>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case "paragraph":
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
    case "link":
      return (
        <a
          href={element.url}
          {...attributes}
          style={{
            color: "blue",
            textDecoration: "underline",
          }}
        >
          {children}
        </a>
      );
    case "image":
      return <ImageElement {...props} />;
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf: React.FC<RenderLeafProps> = (props) => {
  const { attributes, leaf } = props;
  let { children } = props;

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.strikethrough) {
    children = <del>{children}</del>;
  }

  return <span {...attributes}>{children}</span>;
};

const deserialize = (el: any) => {
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  } else if (el.nodeName === "BR") {
    return "\n";
  }

  const { nodeName } = el;
  let parent = el;

  if (
    nodeName === "PRE" &&
    el.childNodes[0] &&
    el.childNodes[0].nodeName === "CODE"
  ) {
    parent = el.childNodes[0];
  }
  let children: any = Array.from(parent.childNodes).map(deserialize).flat();

  if (children.length === 0) {
    children = [{ text: "" }];
  }

  if (el.nodeName === "BODY") {
    return jsx("fragment", {}, children);
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el);
    return jsx("element", attrs, children);
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el);
    return children.map((child: any) => jsx("text", attrs, child));
  }

  return children;
};

const withHtml = (editor: CustomEditor) => {
  const { insertData, isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.type === "link" ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const html = data.getData("text/html");

    if (html) {
      const parsed = new DOMParser().parseFromString(html, "text/html");
      const fragment = deserialize(parsed.body);
      Transforms.insertFragment(editor, fragment);
      return;
    }

    insertData(data);
  };

  return editor;
};

const ImageElement: React.FC<RenderElementProps> = (props) => {
  const { attributes, children, element } = props;
  const selected = useSelected();
  const focused = useFocused();
  return (
    <div {...attributes}>
      {children}
      <img
        src={element.url}
        style={{
          display: "block",
          maxWidth: "100%",
          width: "100%",
          boxShadow: `${selected && focused ? "0 0 0 2px blue;" : "none"}`,
        }}
      />
    </div>
  );
};

// -------------------- START_BLOCK_PLUGIN --------------------//

interface BlockButtonProps {
  format: BlockType;
  render: (active: boolean) => JSX.Element;
}

const BlockButton: React.FC<BlockButtonProps> = (props) => {
  const { format, render } = props;
  const editor = useSlate();

  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();
      toggleBlock(editor, format);
    },
    []
  );

  return (
    <div style={{ display: "inline-block" }} onMouseDown={handleMouseDown}>
      {render(
        isBlockActive(
          editor,
          format,
          TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
        )
      )}
    </div>
  );
};

const toggleBlock = (editor: CustomEditor, format: BlockType) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type as any) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: any;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const isBlockActive = (
  editor: CustomEditor,
  format: BlockType,
  blockType: "align" | "type" = "type"
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  );

  return !!match;
};

// -------------------- END_BLOCK_PLUGIN --------------------//

// -------------------- START_MARK_PLUGIN --------------------//

interface MarkButtonProps {
  format: MarkType;
  render: (active: boolean) => JSX.Element;
}

const MarkButton: React.FC<MarkButtonProps> = (props) => {
  const { format, render } = props;
  const editor = useSlate();

  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();
      toggleMark(editor, format);
    },
    []
  );

  return (
    <div style={{ display: "inline-block" }} onMouseDown={handleMouseDown}>
      {render(isMarkActive(editor, format))}
    </div>
  );
};

const isMarkActive = (editor: CustomEditor, format: MarkType) => {
  const marks: any = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: CustomEditor, format: MarkType) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

// -------------------- END_MARK_PLUGIN --------------------//

// -------------------- START_LINK_PLUGIN --------------------//

const LinkButton: React.FC = () => {
  const editor = useSlate();
  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();

      if (isLinkActive(editor)) {
        unwrapLink(editor);
        return;
      }

      const url = window.prompt("Enter the URL of the link:");
      if (!url) return;
      insertLink(editor, url);
    },
    []
  );

  return (
    <div style={{ display: "inline-block" }} onMouseDown={handleMouseDown}>
      <button
        style={{
          color: isLinkActive(editor) ? "red" : "blue",
        }}
      >
        Link
      </button>
    </div>
  );
};

const withLink = (editor: CustomEditor) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element: SlateElement) =>
    element.type === "link" || isInline(element);

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const isLinkActive = (editor: CustomEditor) => {
  const [link]: any = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  });
  return !!link;
};

const insertLink = (editor: CustomEditor, url: string) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

const wrapLink = (editor: CustomEditor, url: string) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link: CustomElement = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};
const unwrapLink = (editor: CustomEditor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  });
};

// -------------------- END_LINK_PLUGIN --------------------//

// -------------------- START_IMAGE_PLUGIN --------------------//

const InsertImageButton: React.FC = () => {
  const editor = useSlateStatic();

  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();
      const url = window.prompt("Enter the URL of the image:");
      if (url && !isImageUrl(url)) {
        alert("URL is not an image");
        return;
      }
      url && insertImage(editor, url);
    },
    []
  );

  const handleChangeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      insertImage(editor, url);
    }
    e.target.value = "";
  };

  return (
    <>
      <div style={{ display: "inline-block" }} onMouseDown={handleMouseDown}>
        <button>Image</button>
      </div>
      <input type={`file`} accept={`image/*`} onChange={handleChangeUpload} />
    </>
  );
};

const withImages = (editor: CustomEditor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files as any) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result;
            insertImage(editor, url as string);
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const isImageUrl = (url: string) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext: any = new URL(url).pathname.split(".").pop();
  return imageExtensions.includes(ext);
};

const insertImage = (editor: CustomEditor, url: string) => {
  const text = { text: "" };
  const image: CustomElement = { type: "image", url, children: [text] };
  Transforms.insertNodes(editor, image);
};

// -------------------- END_IMAGE_PLUGIN --------------------//
export default SlateEditor;