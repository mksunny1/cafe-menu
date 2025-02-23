(() => {
  // node_modules/deleight/dist/esm/dom/builder/builder.js
  var Builder = class _Builder {
    constructor(tag, ...children) {
      this.attrs = {};
      this.nsAttrs = {};
      this.props = {};
      this.children = [];
      this.components = [];
      this.parents = /* @__PURE__ */ new Set();
      this.tag = tag;
      this.append(...children);
    }
    set(attrs) {
      Object.assign(this.attrs, attrs);
      return this;
    }
    setNs(namespace, attrs) {
      if (!this.nsAttrs.hasOwnProperty(namespace))
        this.nsAttrs[namespace] = {};
      Object.assign(this.nsAttrs[namespace], attrs);
      return this;
    }
    assign(props) {
      Object.assign(this.props, props);
      return this;
    }
    prepend(...children) {
      for (let child of children) {
        this.children.unshift(child);
        if (child instanceof _Builder)
          child.parents.add(this);
      }
      return this;
    }
    append(...children) {
      for (let child of children) {
        this.children.push(child);
        if (child instanceof _Builder)
          child.parents.add(this);
      }
      return this;
    }
    replaceChildren(...children) {
      this.children.length = 0;
      this.append(...children);
      return this;
    }
    apply(...components) {
      this.components.push(...components);
      return this;
    }
    replaceComponents(...components) {
      this.components.length = 0;
      this.apply(...components);
      return this;
    }
    render(indent = 0) {
      const attrs = Object.entries(this.attrs);
      const nsAttrs = Object.entries(this.nsAttrs);
      const pad = new Array(indent).fill(" ").join("");
      return `${pad}<${this.tag}${attrs.length ? ` ${attrs.map(([k, v]) => `${k}="${v.replaceAll('"', "&quot;")}"`).join(" ")}` : ``}${nsAttrs.length ? ` ${nsAttrs.map(([ns, attrs2]) => attrs2.map(([k, v]) => `${ns}:${k}="${v.replaceAll('"', "&quot;")}"`).join(" ")).join(" ")}` : ``}>
${this.children.map((c) => c instanceof _Builder ? c.render(indent + 4) : `${pad}    ${c}`.replaceAll("<", "&lt;").replaceAll(">", "&gt;")).join(`
${pad}`)}
${pad}</${this.tag}>`;
    }
    build() {
      return this.setup(this.create());
    }
    create() {
      throw new Error("You must implement `build` in a subclass");
    }
    setup(element) {
      for (let [k, v] of Object.entries(this.attrs)) {
        element.setAttribute(k, v);
      }
      let qualifiedName, value;
      for (let [namespace, attrs] of Object.entries(this.nsAttrs)) {
        for ([qualifiedName, value] of attrs) {
          element.setAttributeNS(namespace, qualifiedName, value);
        }
      }
      Object.assign(element, this.props);
      element.append(...this.children.map((c) => typeof c === "number" ? `${c}` : c instanceof _Builder ? c.build() : c instanceof Function ? c() : c));
      for (let component of this.components)
        component(element);
      return element;
    }
    appendTo(...targets) {
      for (let target of targets)
        if (target instanceof _Builder) {
          target.append(this);
          this.parents.add(target);
        } else
          target.append(this.build());
      return this;
    }
    prependTo(...targets) {
      for (let target of targets)
        if (target instanceof _Builder) {
          target.prepend(this);
          this.parents.add(target);
        } else
          target.insertBefore(this.build(), target.firstChild);
      return this;
    }
    insertBefore(...targets) {
      let parent, children;
      for (let target of targets)
        if (target instanceof _Builder) {
          for (parent of target.parents) {
            children = parent.children;
            children.splice(children.indexOf(target), 0, this);
          }
        } else
          target.parentNode.insertBefore(this.build(), target);
      return this;
    }
    insertAfter(...targets) {
      let parent, children;
      for (let target of targets)
        if (target instanceof _Builder) {
          for (parent of target.parents) {
            children = parent.children;
            children.splice(children.indexOf(target) + 1, 0, this);
          }
        } else
          target.parentNode.insertBefore(this.build(), target);
      return this;
    }
    replace(...targets) {
      let parent, children;
      for (let target of targets)
        if (target instanceof _Builder) {
          for (parent of target.parents) {
            children = parent.children;
            children[children.indexOf(target)] = this;
          }
        } else
          target.replaceWith(this.build());
      return this;
    }
  };
  var IBuildersProxy = {
    get(target, p) {
      return (...args) => {
        const result = [];
        for (let builder of target.builders)
          result.push(builder[p](...args));
        if (result.length && !(result[0] instanceof Builder))
          return result;
        else
          return target.self || (target.self = new Proxy(target, IBuildersProxy));
      };
    }
  };
  function builders(...builders2) {
    return new Proxy({ builders: builders2 }, IBuildersProxy);
  }
  var b = builders;
  var HTMLElementBuilder = class extends Builder {
    create() {
      return document.createElement(this.tag);
    }
  };
  function html(tag, ...children) {
    return new HTMLElementBuilder(tag, ...children);
  }
  var h = new Proxy(html, {
    get(target, p) {
      return html(p);
    }
  });
  var hh = new Proxy(html, {
    get(target, p) {
      return (...children) => html(p, ...children);
    }
  });
  var SVGElementBuilder = class extends Builder {
    create() {
      return document.createElementNS("http://www.w3.org/2000/svg", this.tag);
    }
  };
  function svg(tag, ...children) {
    return new SVGElementBuilder(tag, ...children);
  }
  var s = new Proxy(svg, {
    get(target, p) {
      return svg(p);
    }
  });
  var ss = new Proxy(svg, {
    get(target, p) {
      return (...children) => svg(p, ...children);
    }
  });
  var MathMLElementBuilder = class extends Builder {
    create() {
      return document.createElementNS("http://www.w3.org/1998/Math/MathML", this.tag);
    }
  };
  function math(tag, ...children) {
    return new MathMLElementBuilder(tag, ...children);
  }
  var m = new Proxy(math, {
    get(target, p) {
      return math(p);
    }
  });
  var mm = new Proxy(math, {
    get(target, p) {
      return (...children) => math(p, ...children);
    }
  });

  // menu.ts
  function item(placeholder) {
    return hh.div(
      h.input.set({ placeholder }),
      h.button.assign({ className: "red no-print", innerHTML: "&#x2715;", onclick: (e) => e.target.parentElement?.remove() })
    ).set({ class: "d-flex ai-center jc-center" }).build();
  }
  function servedWith(value) {
    return h.input.set({ placeholder: "ALL SERVED WITH...", class: "bold red", value });
  }
  b(
    hh.a("< ", hh.small("view code")).set({ href: "https://github.com/mksunny1/cafe-menu", class: "no-print", style: "text-decoration: none;" }),
    hh.header(
      hh.h1("TODAY'S MENU")
    ).set({ class: "t-center" }),
    hh.article(
      hh.div(
        hh.section(
          hh.header(
            h.img.set({ src: "./images/burger.jpg", alt: "Dinner photo", width: "100px", height: "100px", class: "br50 left" }),
            hh.div(
              hh.h2("DINNERS").set({ class: "" }),
              servedWith("SERVED WITH CHIPS, MASH OR VEG")
            ).set({ class: "d-grid t-center" })
          ).set({ class: "d-grid cfr0 ai-center g2" }),
          hh.div(
            hh.button("Add Dinner").set({ class: "main no-print" }).assign({ onclick: (e) => {
              const btn = e.target;
              btn.insertAdjacentElement("beforebegin", item("DINNER NAME"));
            } })
          ).set({ class: "d-grid ji-center t-center" })
        ).set({ class: "d-grid g1 jc-center" }),
        hh.section(
          hh.header(
            hh.div(
              hh.h2("DESSERTS").set({ class: "" }),
              servedWith("SERVED WITH CREAM OR CUSTARD")
            ).set({ class: "d-grid t-center" }),
            h.img.set({ src: "./images/cake.jpg", alt: "Dinner photo", width: "100px", height: "100px", class: "br50 right" })
          ).set({ class: "d-grid cfr0 ai-center g2" }),
          hh.div(
            hh.button("Add Dessert").set({ class: "main no-print" }).assign({ onclick: (e) => {
              const btn = e.target;
              btn.insertAdjacentElement("beforebegin", item("DESSERT NAME"));
            } })
          ).set({ class: "d-grid ji-center t-center" })
        ).set({ class: "d-grid g1 jc-center" })
      ).set({ class: "d-grid g2 jc-center" })
    )
  ).appendTo(document.body);
})();
//# sourceMappingURL=menu.js.map
