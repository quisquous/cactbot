declare global {
  type ShadowRootMode = 'open' | 'closed';

  interface ShadowRootInit {
    mode: ShadowRootMode;
    delegatesFocus?: boolean;
  }

  interface ShadowRoot extends DocumentFragment, DocumentOrShadowRoot {
    host: HTMLElement;
    mode: ShadowRootMode;
  }

  interface Element {
    attachShadow(shadowRootInitDict: ShadowRootInit): ShadowRoot;

    shadowRoot: ShadowRoot | null;

    createShadowRoot(): ShadowRoot
  }
}

export {};
