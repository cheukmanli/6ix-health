/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * The formulation of the Typings will be derived from the documentation
 *  posted through the link below:
 *
 * https://github.com/IHE-SDC-WG/SDC-Schema-Packages/blob/master/Documentation/CAP%20SDC%20Technical%20Reference%20Guide_v0.42%20(Feb%202020).pdf
 */

/** Key name for identifying attributes of parent object. */
export const SDCAttributeName = 'attr';

type TagAttributes =
  | FormDesignAttributes
  | PropertyAttributes<any>
  | CommentAttributes
  | ExtensionAttributes
  | DisplayedItemAttributes
  | BlobContentAttributes
  | ShallowDataAttributes
  | undefined;

type AnyURI = string;

type SDCElement = FormDesign | Property | Comment | Extension;

export type DEType = 'date' | 'string' | 'decimal' | 'integer';

type IntegerDEType = SDCXMLTag<{
  maxInclusive?: number;
  minInclusive?: number;
  quantEnum?: any;
  maxExclusive?: number;
  minExclusive?: number;
  totalDigits?: number;
  mask?: any;
  allowGT?: boolean;
  allowGTE?: boolean;
  allowLT?: boolean;
  allowLTE?: boolean;
  allowAPPROX?: boolean;
}>;

type DecimalDEType = SDCXMLTag<{
  maxInclusive?: number;
  minInclusive?: number;
  quantEnum?: any;
  maxExclusive?: number;
  minExclusive?: number;
  totalDigits?: number;
  mask?: any;
  allowGT?: boolean;
  allowGTE?: boolean;
  allowLT?: boolean;
  allowLTE?: boolean;
  allowAPPROX?: boolean;
}>;

type DateDEType = SDCXMLTag;
type StringDEType = SDCXMLTag<{
  maxLength?: number;
  minLength?: number;
  mask?: string;
  pattern?: string;
}>;

interface FormDesignAttributes {
  xmlns: 'urn:ihe:qrph:sdc:2016';
  'xmlns:xsi': string;
  'xsi:schemaLocation': string;

  formTitle?: string;
  baseURI?: AnyURI;
  basedOnURI?: AnyURI;
  lineage: string;
  version: string;
  /** The previous brtdion of the current PDF */
  versionPrev?: string;
  ID: AnyURI;
  /** The filename of the FDF when is saved to a file storage device. */
  filename?: string;
  /** The full URI that uniquely identifies the current form. */
  fullURI: AnyURI;
}

/**
 * Any tag that extends this inherits *BaseType* from the SDC definitions.
 */
type SDCXMLTag<T extends TagAttributes = undefined> = T extends undefined
  ? { [SDCAttributeName]?: SDCBaseType }
  : { [SDCAttributeName]?: T & SDCBaseType };

/**
 *
 * @page 35 of SDC
 */
export interface SDCBaseType<T = string> {
  name?: T;
  /**
   * The type attribute may contain one or more custom metadata "tokens" for
   *  the element, chosen form a standardized list of terms. It uses the W3C
   *  NMTOKENS type, and thus supports multiple space-separated values. Tokens are
   *  short alphanumeric text strings, defined by the W3C Schema NMTOKEN specification.
   * @page 35 of schema documentation
   */
  type?: string;
  /** We can come up with the proper style classes as we go */
  styleClass?: string;
  order?: number | null;
}

/**
 * Abstract type that confers on descendants the ability to add custom
 *  *Extension*, *Comment* and *Property* elements. Most SDC Types inherit from
 *  EBT, with the notable exceptions of *CommentType*, *ExtensionType*,
 *  *all SDC datatypes*, and some direct derivatives of datatypes.
 *
 * @page 37
 * @type {P} Property *propName* selector type.
 */
interface SDCExtensionBaseType<P extends string = any> {
  Property?: Array<Property<P>> | Property<P>;
  Comment?: Array<Comment> | Comment;
  Extension?: Array<Extension> | Extension;
}

/**
 * DisplayedType attributes are inherited by DisplayedItem, Section, Question,
 * ListItem, and ButtonAction.
 *
 * @page 42
 */
type DisplayedType = {
  /**
   * The primary text to show on the form. Also known as "prompt"
   * or "label" or "visibleText" or "caption"
   */
  title?: string;
  /**
   * Determines whether the user can interact with the displayed item when
   * the form is first displayed. All *disabled* items are treated as read-only:
   * they are visible but may not be edited; they cannot fire events; but they do
   * respond to the *ActivateIf* guard. The *enabled* content value is transitive to
   * descendants, so that all descendants of a *disabled* parent are also disabled,
   * regardless of their *enabled* content value; howhever, descendants of an enable
   * parent may behave according to their own *enabled* content value.
   */
  enabled?: boolean;
  /**
   * Determines whether the item should be visible on a computer screen when the first
   * is first displayed. The *visible* content value is transitive to descendants.
   */
  visible?: boolean;
  /**
   * If this attribute is set to *true* then the form implementation (DEF) must
   * make this item available for use on the form.
   *
   * @page 42, 43
   */
  mustImplement?: boolean;
  /**
   * This attribute is used to omit blocks of XFCs from the FDF report. To omit
   * text from a single XFC, use the *reportText* Property. The default is **true**.
   *
   * @page 43 shows all of the cases for each application of this flag.
   */
  showInReport?: boolean;
};

/**
 * This type represents XFCs that may be repeated based upon the user's interaction with the form
 * objects. Items derived from this type include **Section**s and **Question**s. The handling of
 * **Section** and **Question** repeats will be discussed in section 0.
 *
 * @page 43
 */
interface RepeatingType {
  /**
   * The minimum number of repititions allowed for a *Section* or *Question*.
   *
   * @default 1
   */
  minCard?: number;
  /**
   * The maximum number of repititions allowed for a *Section* or *Question*.
   *
   * @default 1
   */
  maxCard?: number;
  /**
   * Represents the repeat ordinality in an FDF-R, starting with 0. 0 is always
   * used for the original *Question* or *Section*, not a repeated one.
   *
   * @default 0
   */
  repeat?: number;
  instanceGUID?: string;
  parentGUID?: string;
}

export type FormDesignPropertyNameType =
  /** A copyright statement */
  | 'Copyright'
  /** Text that appears at the top of the DEF */
  | 'GenericHeaderText'
  /** The organ group that includes the current form, e.g., "Endocrine" */
  | 'Category'
  /** The full human-readable name of the current form */
  | 'OfficialName'
  /** The name of the CAP Cancer Protocol that contains the current form */
  | 'CAP_ProtocolName'
  /** The abbreviated name of the CAP Cancer Protocol that contains the current form */
  | 'CAP_ProtocolVersion'
  /** A numeric identifier of the form lineage, appended to the lineage title */
  | 'TemplateID'
  /** Rules about when to use or not use this form */
  | 'Restrictions'
  /** The value is "true" if the form is required for Commission on Cnacer accreditation */
  | 'CAP_Required'
  /** The data that this form must go into effect to satisfy the requirements of accreditation-related surveys */
  | 'AccreditationDate'
  /** The date the form was posted on the CAP website */
  | 'WebPostingDate'
  /**  */
  | 'ShortName'
  /**
   * A short text flag that indicates how close the form is to an officially-approved release.
   *  Examples include "CTP1" (Community Technology Preview), "RC2" (Release Candidate) and "REL"
   * (official Release for implementation)
   */
  | 'ApprovalStatus'
  /** The version of the American Joint Committee on Cancer (AJCC) Staging Manual used in the FDF. */
  | 'AJCC_Version';

type QuestionPropertyNameType =
  /** Context specifier type that should be shown in Question */
  | 'reportText'
  /** Enriched HTML. Have not seen an example of this */
  | 'titleHTML'
  /** Display of alternative text for the Question to infer context */
  | 'altText';

/** NOTE: EVERY SDC TAG MUST EXTEND THE *SDCBaseType* */

type Header = SDCXMLTag<{ ID: string }> & SDCExtensionBaseType;
export type Footer = SDCXMLTag<{ ID: string }> & SDCExtensionBaseType;

export type Body = SDCXMLTag<{ ID: string }> &
  SDCExtensionBaseType & {
    // Property?: Property;
    Contact?: Contact;
    ChildItems: ChildItems;
  };

// Property must extend
export type Property<T extends string = any> = SDCExtensionBaseType<T> &
  SDCXMLTag<PropertyAttributes<T>> & /** Strongly typed */ {
    TypedValue?: SDCXMLTag & {} /** This will be one of the many supported data types of SDC. None of the SDC XML Examples provide this, so I will omit it for now. */;
  };

/** @page 41 */
type Comment = SDCXMLTag<CommentAttributes>;
/**
 * Not important for our application.
 * @page 41
 */
type Extension = SDCXMLTag<ExtensionAttributes>;

/**
 *
 * @page 45
 */
type DisplayedItem = SDCXMLTag<DisplayedItemAttributes & DisplayedType> &
  SDCExtensionBaseType<QuestionPropertyNameType>;

/** Not implemented. */
type BlobContent = SDCXMLTag<BlobContentAttributes> &
  SDCExtensionBaseType & {
    Description?: Array<Description> | Description;
    Hash?: Array<Hash> | Hash;
  } & (
    | {
        BinaryMediaBase64: Array<BinaryMediaBase64> | BinaryMediaBase64;
      }
    | {
        BlobURI: Array<BlobURI> | BlobURI;
      }
  );

type BlobContentAttributes = {
  /** MIME type */
  mediaType: string;
  fileExtension?: string;
};
/** Not implemented. */
type Description = SDCXMLTag;
/** Not implemented. */
type Hash = SDCXMLTag;
/** Not implemented. */
type BlobURI = SDCXMLTag;
/** Not implemented. */
type BinaryMediaBase64 = SDCXMLTag;

type Link = SDCXMLTag & SDCExtensionBaseType & {};

type Contact = SDCXMLTag &
  SDCExtensionBaseType & {
    Person?: Array<Person> | Person;
    Organization?: Array<Organization> | Organization;
  };

type Person = SDCXMLTag;

type Organization = SDCXMLTag & {
  OrgName: Array<OrgName> | OrgName;
  Email: Array<Email> | Email;
};

type Email = SDCXMLTag & {
  EmailAddress: EmailAddress;
};
type EmailAddress = SDCXMLTag<ShallowDataAttributes>;
type OrgName = SDCXMLTag<ShallowDataAttributes>;

interface ShallowDataAttributes {
  val: string;
}

export type Section = SDCXMLTag<
  DisplayedItemAttributes & DisplayedType & RepeatingType & { title?: string }
> &
  SDCExtensionBaseType<QuestionPropertyNameType> & {
    ChildItems?: ChildItems;
  };

// Can have children of Question, Section, DisplayedItem
export type ChildItems = SDCXMLTag &
  SDCExtensionBaseType<QuestionPropertyNameType> & {
    Section?: Array<Section> | Section;
    Question?: Array<Question> | Question;
    DisplayedItem?: Array<DisplayedItem> | DisplayedItem;
  };

export type Question = SDCXMLTag<
  DisplayedItemAttributes & DisplayedType & RepeatingType
> &
  SDCExtensionBaseType<QuestionPropertyNameType> & {
    ListField?: ListField;
    ResponseField?: ResponseField;
    ChildItems?: ChildItems;
  };

export type ResponseFieldType = SDCExtensionBaseType<QuestionPropertyNameType> & {
  Response?: SDCResponse;
  TextAfterResponse?: TextAfterResponse;
  ResponseUnits?: ResponseUnits;
};

export type TextAfterResponse = SDCXMLTag<{ val: string }>;
export type ResponseUnits = SDCXMLTag<{
  val: string;
  /** Unified Code for Units of Measure */
  unitSystem: 'UCUM';
}>;
export type SDCResponse = SDCXMLTag & {
  string?: StringDEType;
  decimal?: DecimalDEType;
  integer?: IntegerDEType;
  date?: DateDEType;
};

type ListField = SDCXMLTag<{
  /**
   * If this value is not provided, it is 1.
   *
   * If this value is provided and  0, unlimited amount of selections.
   *
   * If this value is provided and  >= 1, the limit to the number of selects if the value.
   * */
  maxSelections?: number;

  /** Character in the title that separates the columns and rows in a single or multi-column list. */
  colTextDelimiter?: string;

  /**
   * Number of columns in the list
   * @default 1
   */
  numCols?: number;
  /**
   * Determines which column of the list is stored in a database. This list is one-based.
   * @default 1
   */
  storedCol?: number;
  /**
   * The minimum number of answer choices (*ListItems*) that must be selected by the user. Minimum value is 1.
   */
  minSelections?: number;
  /** If false, then the form implementation may change the order of the items in the list. */
  ordered?: boolean;
  /**
   * This attribute contains an SDC datatype enumeration. the selected value is the datatype of the content for all ListItem/...
   *
   * @page 54
   */
  defaultListItemDataType?: any;
}> & {
  List?: List;
  ListHeaderText?: ListHeaderText;
  DefaultCodeSystem?: DefaultCodeSystem;
  IllegalListItemPairiings?: IllegalListItemPairiings;
  IllegalCoSelectedItems?: IllegalCoSelectedItems;
};
type List = SDCXMLTag & {
  ListItem?: Array<ListItem> | ListItem;
};

type ListHeaderText = SDCXMLTag;
type DefaultCodeSystem = SDCXMLTag;
type IllegalListItemPairiings = SDCXMLTag;
type IllegalCoSelectedItems = SDCXMLTag;

type ResponseField = SDCXMLTag & ResponseFieldType;
type ListItemResponseField = SDCXMLTag<{
  /**
   * If true, then the appropriate data must be entered in the data-entry field associated
   * with the *ListItem*
   *
   * @page 50
   */
  responseRequired: boolean;
}> &
  ResponseFieldType;

/**
 * @page 55
 */
type ListItemAttributes = {
  selected?: boolean;
  selectionDisablesChildren?: boolean;
  selectionActivatesItems?: boolean;
  /** @important Look into this. The type is **NMTOKENS** for some reason. */
  selectionSelectsListItems?: string;
  selectionDeselectsSiblings?: boolean;
  omitWhenSelected?: boolean;
  associatedValue?: string;
  /** @important It says the type is: DataTypeAll_StypeEnum. Look into this. */
  associatedValueType?: any;
};

export type ListItem = SDCXMLTag<
  DisplayedItemAttributes & DisplayedType & ListItemAttributes
> &
  SDCExtensionBaseType<QuestionPropertyNameType> & {
    ChildItems?: ChildItems;
    ListItemResponseField?: ListItemResponseField;
  };

type ButtonAction = SDCXMLTag<DisplayedItemAttributes & DisplayedType>;

type IdentifiedExtensionType<E = SDCElement> = E & {
  /**
   * The ubiquitous *ID* attribute is a unique URI identifier for XFC
   * types in FormDesign, and for FormDesign itself. It is required, and its
   * uniqueness is enforced by the SDC Schema. URI identifiers are very flexible
   * since they may assume any legal XML URI format.
   */
  ID: string;
  /**
   * The *baseURI* is required only in the FormDesign element, it is optional on XFCs.
   * It identifies the organization that is responsible for designing and maintaining
   * the FDF on XFC.
   *
   * @page 42
   */
  baseURI: AnyURI;
};

type FormDesignProperty = Property<FormDesignPropertyNameType>;
type QuestionProperty = Property<QuestionPropertyNameType>;
type SectionProperty = Property<QuestionPropertyNameType>;

/**
 * @type {T = string} Generic decorator type
 */
export interface PropertyAttributes<T = string> {
  propName: T;
  val: string;
  propClass?: string;
}

interface CommentAttributes {
  /** The content of the *Comment* */
  val: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ExtensionAttributes {}

interface DisplayedItemAttributes {
  /** Unique ID */
  ID: string;
  title: string;
}

export type FormDesign = IdentifiedExtensionType<
  SDCExtensionBaseType<FormDesignPropertyNameType> &
    SDCXMLTag<FormDesignAttributes>
> & {
  Header?: Header;
  Body: Body;
  Footer: Footer;
};

export type SDCPackage = {
  SDCPackage: SDCXMLTag & {
    XMLPackage: {
      FormDesign: FormDesign;
    };
  };
};
