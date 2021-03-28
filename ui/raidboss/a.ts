type A = {
  id: string;
  setterFunc?: (options: Record<string, string | number>, value: string) => void;
  type: 'directory';
}

type B = {
  id: string;
  setterFunc?: (options: Record<string, string | number>, value: number) => void;
  type: 'float';
};

type OptionTemplate = {
  options: (A | B | never)[];
}

const V: OptionTemplate = {
  options: [
    {
      id: 'hehe',
      type: 'float',
      setterFunc: (options, value) => {
        const a: number = value + 1;
        console.log(a);
      },
    },
    {
      id: '2',
      type: 'directory',
      setterFunc: (options, value) => {
        const a: string = value + '1';
        console.log(a);
      },
    },
  ],
};

console.log(V);
