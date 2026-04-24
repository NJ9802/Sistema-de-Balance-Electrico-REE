export interface REEValue {
  value: number;
  percentage: number;
  datetime: string;
}

export interface REECategory {
  type: string;
  id: string;
  attributes: {
    title: string;
    color: string;
    values: REEValue[];
  };
}

export interface REEResponse {
  included: {
    type: string;
    attributes: {
      content: REECategory[];
    };
  }[];
}
