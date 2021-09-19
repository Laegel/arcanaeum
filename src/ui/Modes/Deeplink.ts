import { navigate } from "svelte-routing";
import { writable } from "svelte/store";
import objectPath from "object-path";

interface StepDefinition {
  action?: (...args: any[]) => void;
}

interface StepData extends StepDefinition  {
  path: string;
  fullPath: string;
}

type StepDefinitions = StepDefinition & { [key: string]: StepDefinition };

type Step = StepData & { [key: string]: Step };

export type Match<T> = Omit<T, "action" | "path">;

export type MatchThing<D, T> = {
  [key in keyof Match<D>]: T;
};

interface MyProxyConstructor {
  new <T extends {}, H extends T>(target: T, handler: ProxyHandler<H>): H;
}

const buildPath = (item) => {
  let currentItem = item;
  const fragments = [];
  while ("parent" in currentItem) {
    fragments.push(currentItem.path);
    currentItem = currentItem.parent;
  }
  return fragments.reverse().join(".");
};

const Deeplinks: StepDefinitions = {
  Modes: {
    action() {
      navigate("/");
    },
    Campaign: {
      action(...args) {
        path.set({ stepName: this.path, args });
      },
    },
    MindTrial: {
      action(...args) {
        path.set({ stepName: this.path, args });
      },
    },
    BodyTrial: {
      action(...args) {
        path.set({ stepName: this.path, args });
      },
    },
    ElementalTrial: {
      action(...args) {
        path.set({ stepName: this.path, args });
      },
    },
  },
  Craft: {
    action() {
      navigate("/craft");
    },
    Effect: {
      action(...args) {
        path.set({ stepName: this.path, args });
      },
    },
    Spell: {
      action(...args) {
        path.set({ stepName: this.path, args });
      },
    },
  },
};

// initialize path, fullPath and parent here
const parentify = (item: StepDefinition, rootPath = ""): Step => {
  for (let prop in item) {
    if (["action", "parent", "path", "fullPath"].includes(prop)) {
      continue;
    }
    const child = item[prop];
    child.parent = item;
    const fullPath = rootPath === "" ? prop : `${rootPath}.${prop}`;
    child.fullPath = fullPath;
    child.path = prop;

    parentify(child, prop);
  }
  return item as Step;
};

export const execute = (path: string) => {
  const stepNames = path.split(".");

  let currentStep = Deeplinks;
  let stepName;
  for (let i = 0; i < stepNames.length; i++) {
    stepName = stepNames[i];
    log(currentStep)
    try {
      currentStep.action();
    } catch (error) {}
    currentStep = currentStep[stepName] as Step;
  }

  return (args: any[]) => {
    return {
      stepName,
      args,
    };
  };
};

const log = (arg) => {
  console.log(arg);
  return arg
}

export default log(parentify(Deeplinks));

export const path = writable({
  stepName: "",
  args: [],
});
