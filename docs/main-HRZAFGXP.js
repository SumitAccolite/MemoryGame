var bh = Object.defineProperty,
  Mh = Object.defineProperties;
var Sh = Object.getOwnPropertyDescriptors;
var Sc = Object.getOwnPropertySymbols;
var xh = Object.prototype.hasOwnProperty,
  Th = Object.prototype.propertyIsEnumerable;
var xc = (t, e, r) =>
    e in t
      ? bh(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (t[e] = r),
  g = (t, e) => {
    for (var r in (e ||= {})) xh.call(e, r) && xc(t, r, e[r]);
    if (Sc) for (var r of Sc(e)) Th.call(e, r) && xc(t, r, e[r]);
    return t;
  },
  H = (t, e) => Mh(t, Sh(e));
var Tc = null;
var Di = 1;
function ae(t) {
  let e = Tc;
  return (Tc = t), e;
}
var Ac = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Ah(t) {
  if (!(Ei(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === Di)) {
    if (!t.producerMustRecompute(t) && !Ci(t)) {
      (t.dirty = !1), (t.lastCleanEpoch = Di);
      return;
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = Di);
  }
}
function _c(t) {
  return t && (t.nextProducerIndex = 0), ae(t);
}
function Nc(t, e) {
  if (
    (ae(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (Ei(t))
      for (let r = t.nextProducerIndex; r < t.producerNode.length; r++)
        wi(t.producerNode[r], t.producerIndexOfThis[r]);
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop();
  }
}
function Ci(t) {
  Er(t);
  for (let e = 0; e < t.producerNode.length; e++) {
    let r = t.producerNode[e],
      n = t.producerLastReadVersion[e];
    if (n !== r.version || (Ah(r), n !== r.version)) return !0;
  }
  return !1;
}
function Oc(t) {
  if ((Er(t), Ei(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      wi(t.producerNode[e], t.producerIndexOfThis[e]);
  (t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function wi(t, e) {
  if ((_h(t), Er(t), t.liveConsumerNode.length === 1))
    for (let n = 0; n < t.producerNode.length; n++)
      wi(t.producerNode[n], t.producerIndexOfThis[n]);
  let r = t.liveConsumerNode.length - 1;
  if (
    ((t.liveConsumerNode[e] = t.liveConsumerNode[r]),
    (t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[r]),
    t.liveConsumerNode.length--,
    t.liveConsumerIndexOfThis.length--,
    e < t.liveConsumerNode.length)
  ) {
    let n = t.liveConsumerIndexOfThis[e],
      o = t.liveConsumerNode[e];
    Er(o), (o.producerIndexOfThis[n] = e);
  }
}
function Ei(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function Er(t) {
  (t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= []);
}
function _h(t) {
  (t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function Nh() {
  throw new Error();
}
var Oh = Nh;
function Rc(t) {
  Oh = t;
}
function E(t) {
  return typeof t == "function";
}
function Lt(t) {
  let r = t((n) => {
    Error.call(n), (n.stack = new Error().stack);
  });
  return (
    (r.prototype = Object.create(Error.prototype)),
    (r.prototype.constructor = r),
    r
  );
}
var Ir = Lt(
  (t) =>
    function (r) {
      t(this),
        (this.message = r
          ? `${r.length} errors occurred during unsubscription:
${r.map((n, o) => `${o + 1}) ${n.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = r);
    }
);
function Mn(t, e) {
  if (t) {
    let r = t.indexOf(e);
    0 <= r && t.splice(r, 1);
  }
}
var z = class t {
  constructor(e) {
    (this.initialTeardown = e),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let e;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: r } = this;
      if (r)
        if (((this._parentage = null), Array.isArray(r)))
          for (let i of r) i.remove(this);
        else r.remove(this);
      let { initialTeardown: n } = this;
      if (E(n))
        try {
          n();
        } catch (i) {
          e = i instanceof Ir ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            Pc(i);
          } catch (s) {
            (e = e ?? []),
              s instanceof Ir ? (e = [...e, ...s.errors]) : e.push(s);
          }
      }
      if (e) throw new Ir(e);
    }
  }
  add(e) {
    var r;
    if (e && e !== this)
      if (this.closed) Pc(e);
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this)) return;
          e._addParent(this);
        }
        (this._finalizers =
          (r = this._finalizers) !== null && r !== void 0 ? r : []).push(e);
      }
  }
  _hasParent(e) {
    let { _parentage: r } = this;
    return r === e || (Array.isArray(r) && r.includes(e));
  }
  _addParent(e) {
    let { _parentage: r } = this;
    this._parentage = Array.isArray(r) ? (r.push(e), r) : r ? [r, e] : e;
  }
  _removeParent(e) {
    let { _parentage: r } = this;
    r === e ? (this._parentage = null) : Array.isArray(r) && Mn(r, e);
  }
  remove(e) {
    let { _finalizers: r } = this;
    r && Mn(r, e), e instanceof t && e._removeParent(this);
  }
};
z.EMPTY = (() => {
  let t = new z();
  return (t.closed = !0), t;
})();
var Ii = z.EMPTY;
function br(t) {
  return (
    t instanceof z ||
    (t && "closed" in t && E(t.remove) && E(t.add) && E(t.unsubscribe))
  );
}
function Pc(t) {
  E(t) ? t() : t.unsubscribe();
}
var we = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var jt = {
  setTimeout(t, e, ...r) {
    let { delegate: n } = jt;
    return n?.setTimeout ? n.setTimeout(t, e, ...r) : setTimeout(t, e, ...r);
  },
  clearTimeout(t) {
    let { delegate: e } = jt;
    return (e?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function Mr(t) {
  jt.setTimeout(() => {
    let { onUnhandledError: e } = we;
    if (e) e(t);
    else throw t;
  });
}
function Sn() {}
var Fc = (() => bi("C", void 0, void 0))();
function kc(t) {
  return bi("E", void 0, t);
}
function Lc(t) {
  return bi("N", t, void 0);
}
function bi(t, e, r) {
  return { kind: t, value: e, error: r };
}
var Ct = null;
function Vt(t) {
  if (we.useDeprecatedSynchronousErrorHandling) {
    let e = !Ct;
    if ((e && (Ct = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: r, error: n } = Ct;
      if (((Ct = null), r)) throw n;
    }
  } else t();
}
function jc(t) {
  we.useDeprecatedSynchronousErrorHandling &&
    Ct &&
    ((Ct.errorThrown = !0), (Ct.error = t));
}
var wt = class extends z {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), br(e) && e.add(this))
          : (this.destination = Fh);
    }
    static create(e, r, n) {
      return new Ut(e, r, n);
    }
    next(e) {
      this.isStopped ? Si(Lc(e), this) : this._next(e);
    }
    error(e) {
      this.isStopped
        ? Si(kc(e), this)
        : ((this.isStopped = !0), this._error(e));
    }
    complete() {
      this.isStopped ? Si(Fc, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(e) {
      this.destination.next(e);
    }
    _error(e) {
      try {
        this.destination.error(e);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  Rh = Function.prototype.bind;
function Mi(t, e) {
  return Rh.call(t, e);
}
var xi = class {
    constructor(e) {
      this.partialObserver = e;
    }
    next(e) {
      let { partialObserver: r } = this;
      if (r.next)
        try {
          r.next(e);
        } catch (n) {
          Sr(n);
        }
    }
    error(e) {
      let { partialObserver: r } = this;
      if (r.error)
        try {
          r.error(e);
        } catch (n) {
          Sr(n);
        }
      else Sr(e);
    }
    complete() {
      let { partialObserver: e } = this;
      if (e.complete)
        try {
          e.complete();
        } catch (r) {
          Sr(r);
        }
    }
  },
  Ut = class extends wt {
    constructor(e, r, n) {
      super();
      let o;
      if (E(e) || !e)
        o = { next: e ?? void 0, error: r ?? void 0, complete: n ?? void 0 };
      else {
        let i;
        this && we.useDeprecatedNextContext
          ? ((i = Object.create(e)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: e.next && Mi(e.next, i),
              error: e.error && Mi(e.error, i),
              complete: e.complete && Mi(e.complete, i),
            }))
          : (o = e);
      }
      this.destination = new xi(o);
    }
  };
function Sr(t) {
  we.useDeprecatedSynchronousErrorHandling ? jc(t) : Mr(t);
}
function Ph(t) {
  throw t;
}
function Si(t, e) {
  let { onStoppedNotification: r } = we;
  r && jt.setTimeout(() => r(t, e));
}
var Fh = { closed: !0, next: Sn, error: Ph, complete: Sn };
var Bt = (() =>
  (typeof Symbol == "function" && Symbol.observable) || "@@observable")();
function ce(t) {
  return t;
}
function Ti(...t) {
  return Ai(t);
}
function Ai(t) {
  return t.length === 0
    ? ce
    : t.length === 1
    ? t[0]
    : function (r) {
        return t.reduce((n, o) => o(n), r);
      };
}
var R = (() => {
  class t {
    constructor(r) {
      r && (this._subscribe = r);
    }
    lift(r) {
      let n = new t();
      return (n.source = this), (n.operator = r), n;
    }
    subscribe(r, n, o) {
      let i = Lh(r) ? r : new Ut(r, n, o);
      return (
        Vt(() => {
          let { operator: s, source: a } = this;
          i.add(
            s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i)
          );
        }),
        i
      );
    }
    _trySubscribe(r) {
      try {
        return this._subscribe(r);
      } catch (n) {
        r.error(n);
      }
    }
    forEach(r, n) {
      return (
        (n = Vc(n)),
        new n((o, i) => {
          let s = new Ut({
            next: (a) => {
              try {
                r(a);
              } catch (c) {
                i(c), s.unsubscribe();
              }
            },
            error: i,
            complete: o,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(r) {
      var n;
      return (n = this.source) === null || n === void 0
        ? void 0
        : n.subscribe(r);
    }
    [Bt]() {
      return this;
    }
    pipe(...r) {
      return Ai(r)(this);
    }
    toPromise(r) {
      return (
        (r = Vc(r)),
        new r((n, o) => {
          let i;
          this.subscribe(
            (s) => (i = s),
            (s) => o(s),
            () => n(i)
          );
        })
      );
    }
  }
  return (t.create = (e) => new t(e)), t;
})();
function Vc(t) {
  var e;
  return (e = t ?? we.Promise) !== null && e !== void 0 ? e : Promise;
}
function kh(t) {
  return t && E(t.next) && E(t.error) && E(t.complete);
}
function Lh(t) {
  return (t && t instanceof wt) || (kh(t) && br(t));
}
function _i(t) {
  return E(t?.lift);
}
function x(t) {
  return (e) => {
    if (_i(e))
      return e.lift(function (r) {
        try {
          return t(r, this);
        } catch (n) {
          this.error(n);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function T(t, e, r, n, o) {
  return new Ni(t, e, r, n, o);
}
var Ni = class extends wt {
  constructor(e, r, n, o, i, s) {
    super(e),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = r
        ? function (a) {
            try {
              r(a);
            } catch (c) {
              e.error(c);
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a);
            } catch (c) {
              e.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = n
        ? function () {
            try {
              n();
            } catch (a) {
              e.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var e;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: r } = this;
      super.unsubscribe(),
        !r && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    }
  }
};
function Ht() {
  return x((t, e) => {
    let r = null;
    t._refCount++;
    let n = T(e, void 0, void 0, void 0, () => {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        r = null;
        return;
      }
      let o = t._connection,
        i = r;
      (r = null), o && (!i || o === i) && o.unsubscribe(), e.unsubscribe();
    });
    t.subscribe(n), n.closed || (r = t.connect());
  });
}
var $t = class extends R {
  constructor(e, r) {
    super(),
      (this.source = e),
      (this.subjectFactory = r),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      _i(e) && (this.lift = e.lift);
  }
  _subscribe(e) {
    return this.getSubject().subscribe(e);
  }
  getSubject() {
    let e = this._subject;
    return (
      (!e || e.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: e } = this;
    (this._subject = this._connection = null), e?.unsubscribe();
  }
  connect() {
    let e = this._connection;
    if (!e) {
      e = this._connection = new z();
      let r = this.getSubject();
      e.add(
        this.source.subscribe(
          T(
            r,
            void 0,
            () => {
              this._teardown(), r.complete();
            },
            (n) => {
              this._teardown(), r.error(n);
            },
            () => this._teardown()
          )
        )
      ),
        e.closed && ((this._connection = null), (e = z.EMPTY));
    }
    return e;
  }
  refCount() {
    return Ht()(this);
  }
};
var Uc = Lt(
  (t) =>
    function () {
      t(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var re = (() => {
    class t extends R {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(r) {
        let n = new xr(this, this);
        return (n.operator = r), n;
      }
      _throwIfClosed() {
        if (this.closed) throw new Uc();
      }
      next(r) {
        Vt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let n of this.currentObservers) n.next(r);
          }
        });
      }
      error(r) {
        Vt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = r);
            let { observers: n } = this;
            for (; n.length; ) n.shift().error(r);
          }
        });
      }
      complete() {
        Vt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: r } = this;
            for (; r.length; ) r.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var r;
        return (
          ((r = this.observers) === null || r === void 0 ? void 0 : r.length) >
          0
        );
      }
      _trySubscribe(r) {
        return this._throwIfClosed(), super._trySubscribe(r);
      }
      _subscribe(r) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(r),
          this._innerSubscribe(r)
        );
      }
      _innerSubscribe(r) {
        let { hasError: n, isStopped: o, observers: i } = this;
        return n || o
          ? Ii
          : ((this.currentObservers = null),
            i.push(r),
            new z(() => {
              (this.currentObservers = null), Mn(i, r);
            }));
      }
      _checkFinalizedStatuses(r) {
        let { hasError: n, thrownError: o, isStopped: i } = this;
        n ? r.error(o) : i && r.complete();
      }
      asObservable() {
        let r = new R();
        return (r.source = this), r;
      }
    }
    return (t.create = (e, r) => new xr(e, r)), t;
  })(),
  xr = class extends re {
    constructor(e, r) {
      super(), (this.destination = e), (this.source = r);
    }
    next(e) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.next) ===
        null ||
        n === void 0 ||
        n.call(r, e);
    }
    error(e) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.error) ===
        null ||
        n === void 0 ||
        n.call(r, e);
    }
    complete() {
      var e, r;
      (r =
        (e = this.destination) === null || e === void 0
          ? void 0
          : e.complete) === null ||
        r === void 0 ||
        r.call(e);
    }
    _subscribe(e) {
      var r, n;
      return (n =
        (r = this.source) === null || r === void 0
          ? void 0
          : r.subscribe(e)) !== null && n !== void 0
        ? n
        : Ii;
    }
  };
var Q = class extends re {
  constructor(e) {
    super(), (this._value = e);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(e) {
    let r = super._subscribe(e);
    return !r.closed && e.next(this._value), r;
  }
  getValue() {
    let { hasError: e, thrownError: r, _value: n } = this;
    if (e) throw r;
    return this._throwIfClosed(), n;
  }
  next(e) {
    super.next((this._value = e));
  }
};
var de = new R((t) => t.complete());
function Bc(t) {
  return t && E(t.schedule);
}
function Hc(t) {
  return t[t.length - 1];
}
function $c(t) {
  return E(Hc(t)) ? t.pop() : void 0;
}
function nt(t) {
  return Bc(Hc(t)) ? t.pop() : void 0;
}
function Gc(t, e, r, n) {
  function o(i) {
    return i instanceof r
      ? i
      : new r(function (s) {
          s(i);
        });
  }
  return new (r || (r = Promise))(function (i, s) {
    function a(l) {
      try {
        u(n.next(l));
      } catch (d) {
        s(d);
      }
    }
    function c(l) {
      try {
        u(n.throw(l));
      } catch (d) {
        s(d);
      }
    }
    function u(l) {
      l.done ? i(l.value) : o(l.value).then(a, c);
    }
    u((n = n.apply(t, e || [])).next());
  });
}
function zc(t) {
  var e = typeof Symbol == "function" && Symbol.iterator,
    r = e && t[e],
    n = 0;
  if (r) return r.call(t);
  if (t && typeof t.length == "number")
    return {
      next: function () {
        return (
          t && n >= t.length && (t = void 0), { value: t && t[n++], done: !t }
        );
      },
    };
  throw new TypeError(
    e ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function Et(t) {
  return this instanceof Et ? ((this.v = t), this) : new Et(t);
}
function Wc(t, e, r) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = r.apply(t, e || []),
    o,
    i = [];
  return (
    (o = {}),
    s("next"),
    s("throw"),
    s("return"),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(f) {
    n[f] &&
      (o[f] = function (h) {
        return new Promise(function (w, O) {
          i.push([f, h, w, O]) > 1 || a(f, h);
        });
      });
  }
  function a(f, h) {
    try {
      c(n[f](h));
    } catch (w) {
      d(i[0][3], w);
    }
  }
  function c(f) {
    f.value instanceof Et
      ? Promise.resolve(f.value.v).then(u, l)
      : d(i[0][2], f);
  }
  function u(f) {
    a("next", f);
  }
  function l(f) {
    a("throw", f);
  }
  function d(f, h) {
    f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
  }
}
function qc(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var e = t[Symbol.asyncIterator],
    r;
  return e
    ? e.call(t)
    : ((t = typeof zc == "function" ? zc(t) : t[Symbol.iterator]()),
      (r = {}),
      n("next"),
      n("throw"),
      n("return"),
      (r[Symbol.asyncIterator] = function () {
        return this;
      }),
      r);
  function n(i) {
    r[i] =
      t[i] &&
      function (s) {
        return new Promise(function (a, c) {
          (s = t[i](s)), o(a, c, s.done, s.value);
        });
      };
  }
  function o(i, s, a, c) {
    Promise.resolve(c).then(function (u) {
      i({ value: u, done: a });
    }, s);
  }
}
var Tr = (t) => t && typeof t.length == "number" && typeof t != "function";
function Ar(t) {
  return E(t?.then);
}
function _r(t) {
  return E(t[Bt]);
}
function Nr(t) {
  return Symbol.asyncIterator && E(t?.[Symbol.asyncIterator]);
}
function Or(t) {
  return new TypeError(
    `You provided ${
      t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function jh() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var Rr = jh();
function Pr(t) {
  return E(t?.[Rr]);
}
function Fr(t) {
  return Wc(this, arguments, function* () {
    let r = t.getReader();
    try {
      for (;;) {
        let { value: n, done: o } = yield Et(r.read());
        if (o) return yield Et(void 0);
        yield yield Et(n);
      }
    } finally {
      r.releaseLock();
    }
  });
}
function kr(t) {
  return E(t?.getReader);
}
function q(t) {
  if (t instanceof R) return t;
  if (t != null) {
    if (_r(t)) return Vh(t);
    if (Tr(t)) return Uh(t);
    if (Ar(t)) return Bh(t);
    if (Nr(t)) return Zc(t);
    if (Pr(t)) return Hh(t);
    if (kr(t)) return $h(t);
  }
  throw Or(t);
}
function Vh(t) {
  return new R((e) => {
    let r = t[Bt]();
    if (E(r.subscribe)) return r.subscribe(e);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function Uh(t) {
  return new R((e) => {
    for (let r = 0; r < t.length && !e.closed; r++) e.next(t[r]);
    e.complete();
  });
}
function Bh(t) {
  return new R((e) => {
    t.then(
      (r) => {
        e.closed || (e.next(r), e.complete());
      },
      (r) => e.error(r)
    ).then(null, Mr);
  });
}
function Hh(t) {
  return new R((e) => {
    for (let r of t) if ((e.next(r), e.closed)) return;
    e.complete();
  });
}
function Zc(t) {
  return new R((e) => {
    zh(t, e).catch((r) => e.error(r));
  });
}
function $h(t) {
  return Zc(Fr(t));
}
function zh(t, e) {
  var r, n, o, i;
  return Gc(this, void 0, void 0, function* () {
    try {
      for (r = qc(t); (n = yield r.next()), !n.done; ) {
        let s = n.value;
        if ((e.next(s), e.closed)) return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        n && !n.done && (i = r.return) && (yield i.call(r));
      } finally {
        if (o) throw o.error;
      }
    }
    e.complete();
  });
}
function oe(t, e, r, n = 0, o = !1) {
  let i = e.schedule(function () {
    r(), o ? t.add(this.schedule(null, n)) : this.unsubscribe();
  }, n);
  if ((t.add(i), !o)) return i;
}
function Lr(t, e = 0) {
  return x((r, n) => {
    r.subscribe(
      T(
        n,
        (o) => oe(n, t, () => n.next(o), e),
        () => oe(n, t, () => n.complete(), e),
        (o) => oe(n, t, () => n.error(o), e)
      )
    );
  });
}
function jr(t, e = 0) {
  return x((r, n) => {
    n.add(t.schedule(() => r.subscribe(n), e));
  });
}
function Yc(t, e) {
  return q(t).pipe(jr(e), Lr(e));
}
function Qc(t, e) {
  return q(t).pipe(jr(e), Lr(e));
}
function Jc(t, e) {
  return new R((r) => {
    let n = 0;
    return e.schedule(function () {
      n === t.length
        ? r.complete()
        : (r.next(t[n++]), r.closed || this.schedule());
    });
  });
}
function Kc(t, e) {
  return new R((r) => {
    let n;
    return (
      oe(r, e, () => {
        (n = t[Rr]()),
          oe(
            r,
            e,
            () => {
              let o, i;
              try {
                ({ value: o, done: i } = n.next());
              } catch (s) {
                r.error(s);
                return;
              }
              i ? r.complete() : r.next(o);
            },
            0,
            !0
          );
      }),
      () => E(n?.return) && n.return()
    );
  });
}
function Vr(t, e) {
  if (!t) throw new Error("Iterable cannot be null");
  return new R((r) => {
    oe(r, e, () => {
      let n = t[Symbol.asyncIterator]();
      oe(
        r,
        e,
        () => {
          n.next().then((o) => {
            o.done ? r.complete() : r.next(o.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function Xc(t, e) {
  return Vr(Fr(t), e);
}
function eu(t, e) {
  if (t != null) {
    if (_r(t)) return Yc(t, e);
    if (Tr(t)) return Jc(t, e);
    if (Ar(t)) return Qc(t, e);
    if (Nr(t)) return Vr(t, e);
    if (Pr(t)) return Kc(t, e);
    if (kr(t)) return Xc(t, e);
  }
  throw Or(t);
}
function B(t, e) {
  return e ? eu(t, e) : q(t);
}
function C(...t) {
  let e = nt(t);
  return B(t, e);
}
function zt(t, e) {
  let r = E(t) ? t : () => t,
    n = (o) => o.error(r());
  return new R(e ? (o) => e.schedule(n, 0, o) : n);
}
function Oi(t) {
  return !!t && (t instanceof R || (E(t.lift) && E(t.subscribe)));
}
var qe = Lt(
  (t) =>
    function () {
      t(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function A(t, e) {
  return x((r, n) => {
    let o = 0;
    r.subscribe(
      T(n, (i) => {
        n.next(t.call(e, i, o++));
      })
    );
  });
}
var { isArray: Gh } = Array;
function Wh(t, e) {
  return Gh(e) ? t(...e) : t(e);
}
function tu(t) {
  return A((e) => Wh(t, e));
}
var { isArray: qh } = Array,
  { getPrototypeOf: Zh, prototype: Yh, keys: Qh } = Object;
function nu(t) {
  if (t.length === 1) {
    let e = t[0];
    if (qh(e)) return { args: e, keys: null };
    if (Jh(e)) {
      let r = Qh(e);
      return { args: r.map((n) => e[n]), keys: r };
    }
  }
  return { args: t, keys: null };
}
function Jh(t) {
  return t && typeof t == "object" && Zh(t) === Yh;
}
function ru(t, e) {
  return t.reduce((r, n, o) => ((r[n] = e[o]), r), {});
}
function xn(...t) {
  let e = nt(t),
    r = $c(t),
    { args: n, keys: o } = nu(t);
  if (n.length === 0) return B([], e);
  let i = new R(Kh(n, e, o ? (s) => ru(o, s) : ce));
  return r ? i.pipe(tu(r)) : i;
}
function Kh(t, e, r = ce) {
  return (n) => {
    ou(
      e,
      () => {
        let { length: o } = t,
          i = new Array(o),
          s = o,
          a = o;
        for (let c = 0; c < o; c++)
          ou(
            e,
            () => {
              let u = B(t[c], e),
                l = !1;
              u.subscribe(
                T(
                  n,
                  (d) => {
                    (i[c] = d), l || ((l = !0), a--), a || n.next(r(i.slice()));
                  },
                  () => {
                    --s || n.complete();
                  }
                )
              );
            },
            n
          );
      },
      n
    );
  };
}
function ou(t, e, r) {
  t ? oe(r, t, e) : e();
}
function iu(t, e, r, n, o, i, s, a) {
  let c = [],
    u = 0,
    l = 0,
    d = !1,
    f = () => {
      d && !c.length && !u && e.complete();
    },
    h = (O) => (u < n ? w(O) : c.push(O)),
    w = (O) => {
      i && e.next(O), u++;
      let K = !1;
      q(r(O, l++)).subscribe(
        T(
          e,
          (j) => {
            o?.(j), i ? h(j) : e.next(j);
          },
          () => {
            K = !0;
          },
          void 0,
          () => {
            if (K)
              try {
                for (u--; c.length && u < n; ) {
                  let j = c.shift();
                  s ? oe(e, s, () => w(j)) : w(j);
                }
                f();
              } catch (j) {
                e.error(j);
              }
          }
        )
      );
    };
  return (
    t.subscribe(
      T(e, h, () => {
        (d = !0), f();
      })
    ),
    () => {
      a?.();
    }
  );
}
function $(t, e, r = 1 / 0) {
  return E(e)
    ? $((n, o) => A((i, s) => e(n, i, o, s))(q(t(n, o))), r)
    : (typeof e == "number" && (r = e), x((n, o) => iu(n, o, t, r)));
}
function Gt(t = 1 / 0) {
  return $(ce, t);
}
function su() {
  return Gt(1);
}
function Wt(...t) {
  return su()(B(t, nt(t)));
}
function Ur(t) {
  return new R((e) => {
    q(t()).subscribe(e);
  });
}
function fe(t, e) {
  return x((r, n) => {
    let o = 0;
    r.subscribe(T(n, (i) => t.call(e, i, o++) && n.next(i)));
  });
}
function rt(t) {
  return x((e, r) => {
    let n = null,
      o = !1,
      i;
    (n = e.subscribe(
      T(r, void 0, void 0, (s) => {
        (i = q(t(s, rt(t)(e)))),
          n ? (n.unsubscribe(), (n = null), i.subscribe(r)) : (o = !0);
      })
    )),
      o && (n.unsubscribe(), (n = null), i.subscribe(r));
  });
}
function au(t, e, r, n, o) {
  return (i, s) => {
    let a = r,
      c = e,
      u = 0;
    i.subscribe(
      T(
        s,
        (l) => {
          let d = u++;
          (c = a ? t(c, l, d) : ((a = !0), l)), n && s.next(c);
        },
        o &&
          (() => {
            a && s.next(c), s.complete();
          })
      )
    );
  };
}
function It(t, e) {
  return E(e) ? $(t, e, 1) : $(t, 1);
}
function ot(t) {
  return x((e, r) => {
    let n = !1;
    e.subscribe(
      T(
        r,
        (o) => {
          (n = !0), r.next(o);
        },
        () => {
          n || r.next(t), r.complete();
        }
      )
    );
  });
}
function Ze(t) {
  return t <= 0
    ? () => de
    : x((e, r) => {
        let n = 0;
        e.subscribe(
          T(r, (o) => {
            ++n <= t && (r.next(o), t <= n && r.complete());
          })
        );
      });
}
function Ri(t) {
  return A(() => t);
}
function Br(t = Xh) {
  return x((e, r) => {
    let n = !1;
    e.subscribe(
      T(
        r,
        (o) => {
          (n = !0), r.next(o);
        },
        () => (n ? r.complete() : r.error(t()))
      )
    );
  });
}
function Xh() {
  return new qe();
}
function Tn(t) {
  return x((e, r) => {
    try {
      e.subscribe(r);
    } finally {
      r.add(t);
    }
  });
}
function Re(t, e) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      t ? fe((o, i) => t(o, i, n)) : ce,
      Ze(1),
      r ? ot(e) : Br(() => new qe())
    );
}
function qt(t) {
  return t <= 0
    ? () => de
    : x((e, r) => {
        let n = [];
        e.subscribe(
          T(
            r,
            (o) => {
              n.push(o), t < n.length && n.shift();
            },
            () => {
              for (let o of n) r.next(o);
              r.complete();
            },
            void 0,
            () => {
              n = null;
            }
          )
        );
      });
}
function Pi(t, e) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      t ? fe((o, i) => t(o, i, n)) : ce,
      qt(1),
      r ? ot(e) : Br(() => new qe())
    );
}
function Fi(t, e) {
  return x(au(t, e, arguments.length >= 2, !0));
}
function ki(...t) {
  let e = nt(t);
  return x((r, n) => {
    (e ? Wt(t, r, e) : Wt(t, r)).subscribe(n);
  });
}
function he(t, e) {
  return x((r, n) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && n.complete();
    r.subscribe(
      T(
        n,
        (c) => {
          o?.unsubscribe();
          let u = 0,
            l = i++;
          q(t(c, l)).subscribe(
            (o = T(
              n,
              (d) => n.next(e ? e(c, d, l, u++) : d),
              () => {
                (o = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
function Li(t) {
  return x((e, r) => {
    q(t).subscribe(T(r, () => r.complete(), Sn)), !r.closed && e.subscribe(r);
  });
}
function Z(t, e, r) {
  let n = E(t) || e || r ? { next: t, error: e, complete: r } : t;
  return n
    ? x((o, i) => {
        var s;
        (s = n.subscribe) === null || s === void 0 || s.call(n);
        let a = !0;
        o.subscribe(
          T(
            i,
            (c) => {
              var u;
              (u = n.next) === null || u === void 0 || u.call(n, c), i.next(c);
            },
            () => {
              var c;
              (a = !1),
                (c = n.complete) === null || c === void 0 || c.call(n),
                i.complete();
            },
            (c) => {
              var u;
              (a = !1),
                (u = n.error) === null || u === void 0 || u.call(n, c),
                i.error(c);
            },
            () => {
              var c, u;
              a && ((c = n.unsubscribe) === null || c === void 0 || c.call(n)),
                (u = n.finalize) === null || u === void 0 || u.call(n);
            }
          )
        );
      })
    : ce;
}
function P(t) {
  for (let e in t) if (t[e] === P) return e;
  throw Error("Could not find renamed property on target object.");
}
function ee(t) {
  if (typeof t == "string") return t;
  if (Array.isArray(t)) return "[" + t.map(ee).join(", ") + "]";
  if (t == null) return "" + t;
  if (t.overriddenName) return `${t.overriddenName}`;
  if (t.name) return `${t.name}`;
  let e = t.toString();
  if (e == null) return "" + e;
  let r = e.indexOf(`
`);
  return r === -1 ? e : e.substring(0, r);
}
function cu(t, e) {
  return t == null || t === ""
    ? e === null
      ? ""
      : e
    : e == null || e === ""
    ? t
    : t + " " + e;
}
var ep = P({ __forward_ref__: P });
function Wu(t) {
  return (
    (t.__forward_ref__ = Wu),
    (t.toString = function () {
      return ee(this());
    }),
    t
  );
}
function ge(t) {
  return qu(t) ? t() : t;
}
function qu(t) {
  return (
    typeof t == "function" && t.hasOwnProperty(ep) && t.__forward_ref__ === Wu
  );
}
function Zu(t) {
  return t && !!t.ɵproviders;
}
var Yu = "https://g.co/ng/security#xss",
  m = class extends Error {
    constructor(e, r) {
      super(Rs(e, r)), (this.code = e);
    }
  };
function Rs(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ": " + e : ""}`;
}
var tp = P({ ɵcmp: P }),
  np = P({ ɵdir: P }),
  rp = P({ ɵpipe: P }),
  op = P({ ɵmod: P }),
  Qr = P({ ɵfac: P }),
  An = P({ __NG_ELEMENT_ID__: P }),
  uu = P({ __NG_ENV_ID__: P });
function vo(t) {
  return typeof t == "string" ? t : t == null ? "" : String(t);
}
function ip(t) {
  return typeof t == "function"
    ? t.name || t.toString()
    : typeof t == "object" && t != null && typeof t.type == "function"
    ? t.type.name || t.type.toString()
    : vo(t);
}
function sp(t, e) {
  let r = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
  throw new m(-200, `Circular dependency in DI detected for ${t}${r}`);
}
function Ps(t, e) {
  let r = e ? ` in ${e}` : "";
  throw new m(-201, !1);
}
function ap(t, e) {
  t == null && cp(e, t, null, "!=");
}
function cp(t, e, r, n) {
  throw new Error(
    `ASSERTION ERROR: ${t}` +
      (n == null ? "" : ` [Expected=> ${r} ${n} ${e} <=Actual]`)
  );
}
function y(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  };
}
function Se(t) {
  return { providers: t.providers || [], imports: t.imports || [] };
}
function yo(t) {
  return lu(t, Ju) || lu(t, Ku);
}
function Qu(t) {
  return yo(t) !== null;
}
function lu(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null;
}
function up(t) {
  let e = t && (t[Ju] || t[Ku]);
  return e || null;
}
function du(t) {
  return t && (t.hasOwnProperty(fu) || t.hasOwnProperty(lp)) ? t[fu] : null;
}
var Ju = P({ ɵprov: P }),
  fu = P({ ɵinj: P }),
  Ku = P({ ngInjectableDef: P }),
  lp = P({ ngInjectorDef: P }),
  M = (function (t) {
    return (
      (t[(t.Default = 0)] = "Default"),
      (t[(t.Host = 1)] = "Host"),
      (t[(t.Self = 2)] = "Self"),
      (t[(t.SkipSelf = 4)] = "SkipSelf"),
      (t[(t.Optional = 8)] = "Optional"),
      t
    );
  })(M || {}),
  qi;
function Xu() {
  return qi;
}
function pe(t) {
  let e = qi;
  return (qi = t), e;
}
function el(t, e, r) {
  let n = yo(t);
  if (n && n.providedIn == "root")
    return n.value === void 0 ? (n.value = n.factory()) : n.value;
  if (r & M.Optional) return null;
  if (e !== void 0) return e;
  Ps(ee(t), "Injector");
}
var te = globalThis;
var I = class {
  constructor(e, r) {
    (this._desc = e),
      (this.ngMetadataName = "InjectionToken"),
      (this.ɵprov = void 0),
      typeof r == "number"
        ? (this.__NG_ELEMENT_ID__ = r)
        : r !== void 0 &&
          (this.ɵprov = y({
            token: this,
            providedIn: r.providedIn || "root",
            factory: r.factory,
          }));
  }
  get multi() {
    return this;
  }
  toString() {
    return `InjectionToken ${this._desc}`;
  }
};
var dp = {},
  Nn = dp,
  Zi = "__NG_DI_FLAG__",
  Jr = "ngTempTokenPath",
  fp = "ngTokenPath",
  hp = /\n/gm,
  pp = "\u0275",
  hu = "__source",
  Kt;
function gp() {
  return Kt;
}
function it(t) {
  let e = Kt;
  return (Kt = t), e;
}
function mp(t, e = M.Default) {
  if (Kt === void 0) throw new m(-203, !1);
  return Kt === null
    ? el(t, void 0, e)
    : Kt.get(t, e & M.Optional ? null : void 0, e);
}
function v(t, e = M.Default) {
  return (Xu() || mp)(ge(t), e);
}
function p(t, e = M.Default) {
  return v(t, Do(e));
}
function Do(t) {
  return typeof t > "u" || typeof t == "number"
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function Yi(t) {
  let e = [];
  for (let r = 0; r < t.length; r++) {
    let n = ge(t[r]);
    if (Array.isArray(n)) {
      if (n.length === 0) throw new m(900, !1);
      let o,
        i = M.Default;
      for (let s = 0; s < n.length; s++) {
        let a = n[s],
          c = vp(a);
        typeof c == "number" ? (c === -1 ? (o = a.token) : (i |= c)) : (o = a);
      }
      e.push(v(o, i));
    } else e.push(v(n));
  }
  return e;
}
function tl(t, e) {
  return (t[Zi] = e), (t.prototype[Zi] = e), t;
}
function vp(t) {
  return t[Zi];
}
function yp(t, e, r, n) {
  let o = t[Jr];
  throw (
    (e[hu] && o.unshift(e[hu]),
    (t.message = Dp(
      `
` + t.message,
      o,
      r,
      n
    )),
    (t[fp] = o),
    (t[Jr] = null),
    t)
  );
}
function Dp(t, e, r, n = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == pp
      ? t.slice(2)
      : t;
  let o = ee(e);
  if (Array.isArray(e)) o = e.map(ee).join(" -> ");
  else if (typeof e == "object") {
    let i = [];
    for (let s in e)
      if (e.hasOwnProperty(s)) {
        let a = e[s];
        i.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : ee(a)));
      }
    o = `{${i.join(", ")}}`;
  }
  return `${r}${n ? "(" + n + ")" : ""}[${o}]: ${t.replace(
    hp,
    `
  `
  )}`;
}
function Hn(t) {
  return { toString: t }.toString();
}
var nl = (function (t) {
    return (t[(t.OnPush = 0)] = "OnPush"), (t[(t.Default = 1)] = "Default"), t;
  })(nl || {}),
  Le = (function (t) {
    return (
      (t[(t.Emulated = 0)] = "Emulated"),
      (t[(t.None = 2)] = "None"),
      (t[(t.ShadowDom = 3)] = "ShadowDom"),
      t
    );
  })(Le || {}),
  On = {},
  Pe = [];
function rl(t, e, r) {
  let n = t.length;
  for (;;) {
    let o = t.indexOf(e, r);
    if (o === -1) return o;
    if (o === 0 || t.charCodeAt(o - 1) <= 32) {
      let i = e.length;
      if (o + i === n || t.charCodeAt(o + i) <= 32) return o;
    }
    r = o + 1;
  }
}
function Qi(t, e, r) {
  let n = 0;
  for (; n < r.length; ) {
    let o = r[n];
    if (typeof o == "number") {
      if (o !== 0) break;
      n++;
      let i = r[n++],
        s = r[n++],
        a = r[n++];
      t.setAttribute(e, s, a, i);
    } else {
      let i = o,
        s = r[++n];
      Cp(i) ? t.setProperty(e, i, s) : t.setAttribute(e, i, s), n++;
    }
  }
  return n;
}
function ol(t) {
  return t === 3 || t === 4 || t === 6;
}
function Cp(t) {
  return t.charCodeAt(0) === 64;
}
function Fs(t, e) {
  if (!(e === null || e.length === 0))
    if (t === null || t.length === 0) t = e.slice();
    else {
      let r = -1;
      for (let n = 0; n < e.length; n++) {
        let o = e[n];
        typeof o == "number"
          ? (r = o)
          : r === 0 ||
            (r === -1 || r === 2
              ? pu(t, r, o, null, e[++n])
              : pu(t, r, o, null, null));
      }
    }
  return t;
}
function pu(t, e, r, n, o) {
  let i = 0,
    s = t.length;
  if (e === -1) s = -1;
  else
    for (; i < t.length; ) {
      let a = t[i++];
      if (typeof a == "number") {
        if (a === e) {
          s = -1;
          break;
        } else if (a > e) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < t.length; ) {
    let a = t[i];
    if (typeof a == "number") break;
    if (a === r) {
      if (n === null) {
        o !== null && (t[i + 1] = o);
        return;
      } else if (n === t[i + 1]) {
        t[i + 2] = o;
        return;
      }
    }
    i++, n !== null && i++, o !== null && i++;
  }
  s !== -1 && (t.splice(s, 0, e), (i = s + 1)),
    t.splice(i++, 0, r),
    n !== null && t.splice(i++, 0, n),
    o !== null && t.splice(i++, 0, o);
}
var il = "ng-template";
function wp(t, e, r) {
  let n = 0,
    o = !0;
  for (; n < t.length; ) {
    let i = t[n++];
    if (typeof i == "string" && o) {
      let s = t[n++];
      if (r && i === "class" && rl(s.toLowerCase(), e, 0) !== -1) return !0;
    } else if (i === 1) {
      for (; n < t.length && typeof (i = t[n++]) == "string"; )
        if (i.toLowerCase() === e) return !0;
      return !1;
    } else typeof i == "number" && (o = !1);
  }
  return !1;
}
function sl(t) {
  return t.type === 4 && t.value !== il;
}
function Ep(t, e, r) {
  let n = t.type === 4 && !r ? il : t.value;
  return e === n;
}
function Ip(t, e, r) {
  let n = 4,
    o = t.attrs || [],
    i = Sp(o),
    s = !1;
  for (let a = 0; a < e.length; a++) {
    let c = e[a];
    if (typeof c == "number") {
      if (!s && !Ee(n) && !Ee(c)) return !1;
      if (s && Ee(c)) continue;
      (s = !1), (n = c | (n & 1));
      continue;
    }
    if (!s)
      if (n & 4) {
        if (
          ((n = 2 | (n & 1)),
          (c !== "" && !Ep(t, c, r)) || (c === "" && e.length === 1))
        ) {
          if (Ee(n)) return !1;
          s = !0;
        }
      } else {
        let u = n & 8 ? c : e[++a];
        if (n & 8 && t.attrs !== null) {
          if (!wp(t.attrs, u, r)) {
            if (Ee(n)) return !1;
            s = !0;
          }
          continue;
        }
        let l = n & 8 ? "class" : c,
          d = bp(l, o, sl(t), r);
        if (d === -1) {
          if (Ee(n)) return !1;
          s = !0;
          continue;
        }
        if (u !== "") {
          let f;
          d > i ? (f = "") : (f = o[d + 1].toLowerCase());
          let h = n & 8 ? f : null;
          if ((h && rl(h, u, 0) !== -1) || (n & 2 && u !== f)) {
            if (Ee(n)) return !1;
            s = !0;
          }
        }
      }
  }
  return Ee(n) || s;
}
function Ee(t) {
  return (t & 1) === 0;
}
function bp(t, e, r, n) {
  if (e === null) return -1;
  let o = 0;
  if (n || !r) {
    let i = !1;
    for (; o < e.length; ) {
      let s = e[o];
      if (s === t) return o;
      if (s === 3 || s === 6) i = !0;
      else if (s === 1 || s === 2) {
        let a = e[++o];
        for (; typeof a == "string"; ) a = e[++o];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          o += 4;
          continue;
        }
      }
      o += i ? 1 : 2;
    }
    return -1;
  } else return xp(e, t);
}
function Mp(t, e, r = !1) {
  for (let n = 0; n < e.length; n++) if (Ip(t, e[n], r)) return !0;
  return !1;
}
function Sp(t) {
  for (let e = 0; e < t.length; e++) {
    let r = t[e];
    if (ol(r)) return e;
  }
  return t.length;
}
function xp(t, e) {
  let r = t.indexOf(4);
  if (r > -1)
    for (r++; r < t.length; ) {
      let n = t[r];
      if (typeof n == "number") return -1;
      if (n === e) return r;
      r++;
    }
  return -1;
}
function gu(t, e) {
  return t ? ":not(" + e.trim() + ")" : e;
}
function Tp(t) {
  let e = t[0],
    r = 1,
    n = 2,
    o = "",
    i = !1;
  for (; r < t.length; ) {
    let s = t[r];
    if (typeof s == "string")
      if (n & 2) {
        let a = t[++r];
        o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else n & 8 ? (o += "." + s) : n & 4 && (o += " " + s);
    else
      o !== "" && !Ee(s) && ((e += gu(i, o)), (o = "")),
        (n = s),
        (i = i || !Ee(n));
    r++;
  }
  return o !== "" && (e += gu(i, o)), e;
}
function Ap(t) {
  return t.map(Tp).join(",");
}
function _p(t) {
  let e = [],
    r = [],
    n = 1,
    o = 2;
  for (; n < t.length; ) {
    let i = t[n];
    if (typeof i == "string")
      o === 2 ? i !== "" && e.push(i, t[++n]) : o === 8 && r.push(i);
    else {
      if (!Ee(o)) break;
      o = i;
    }
    n++;
  }
  return { attrs: e, classes: r };
}
function Be(t) {
  return Hn(() => {
    let e = dl(t),
      r = H(g({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === nl.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || Le.Emulated,
        styles: t.styles || Pe,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: "",
      });
    fl(r);
    let n = t.dependencies;
    return (
      (r.directiveDefs = vu(n, !1)), (r.pipeDefs = vu(n, !0)), (r.id = Rp(r)), r
    );
  });
}
function Np(t) {
  return ct(t) || al(t);
}
function Op(t) {
  return t !== null;
}
function xe(t) {
  return Hn(() => ({
    type: t.type,
    bootstrap: t.bootstrap || Pe,
    declarations: t.declarations || Pe,
    imports: t.imports || Pe,
    exports: t.exports || Pe,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }));
}
function mu(t, e) {
  if (t == null) return On;
  let r = {};
  for (let n in t)
    if (t.hasOwnProperty(n)) {
      let o = t[n],
        i = o;
      Array.isArray(o) && ((i = o[1]), (o = o[0])), (r[o] = n), e && (e[o] = i);
    }
  return r;
}
function dt(t) {
  return Hn(() => {
    let e = dl(t);
    return fl(e), e;
  });
}
function ct(t) {
  return t[tp] || null;
}
function al(t) {
  return t[np] || null;
}
function cl(t) {
  return t[rp] || null;
}
function ul(t) {
  let e = ct(t) || al(t) || cl(t);
  return e !== null ? e.standalone : !1;
}
function ll(t, e) {
  let r = t[op] || null;
  if (!r && e === !0)
    throw new Error(`Type ${ee(t)} does not have '\u0275mod' property.`);
  return r;
}
function dl(t) {
  let e = {};
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: e,
    inputTransforms: null,
    inputConfig: t.inputs || On,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || Pe,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: mu(t.inputs, e),
    outputs: mu(t.outputs),
    debugInfo: null,
  };
}
function fl(t) {
  t.features?.forEach((e) => e(t));
}
function vu(t, e) {
  if (!t) return null;
  let r = e ? cl : Np;
  return () => (typeof t == "function" ? t() : t).map((n) => r(n)).filter(Op);
}
function Rp(t) {
  let e = 0,
    r = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      t.consts,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ].join("|");
  for (let o of r) e = (Math.imul(31, e) + o.charCodeAt(0)) << 0;
  return (e += 2147483647 + 1), "c" + e;
}
var Qe = 0,
  _ = 1,
  D = 2,
  G = 3,
  Ie = 4,
  Te = 5,
  Kr = 6,
  Rn = 7,
  be = 8,
  en = 9,
  Ye = 10,
  J = 11,
  Pn = 12,
  yu = 13,
  an = 14,
  je = 15,
  Co = 16,
  Zt = 17,
  Fn = 18,
  wo = 19,
  hl = 20,
  st = 21,
  ji = 22,
  Mt = 23,
  ut = 25,
  pl = 1;
var St = 7,
  Xr = 8,
  eo = 9,
  me = 10,
  tn = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      (t[(t.HasChildViewsToRefresh = 4)] = "HasChildViewsToRefresh"),
      t
    );
  })(tn || {});
function at(t) {
  return Array.isArray(t) && typeof t[pl] == "object";
}
function Me(t) {
  return Array.isArray(t) && t[pl] === !0;
}
function gl(t) {
  return (t.flags & 4) !== 0;
}
function Eo(t) {
  return t.componentOffset > -1;
}
function ks(t) {
  return (t.flags & 1) === 1;
}
function $n(t) {
  return !!t.template;
}
function Pp(t) {
  return (t[D] & 512) !== 0;
}
function nn(t, e) {
  let r = t.hasOwnProperty(Qr);
  return r ? t[Qr] : null;
}
var Ji = class {
  constructor(e, r, n) {
    (this.previousValue = e), (this.currentValue = r), (this.firstChange = n);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function zn() {
  return ml;
}
function ml(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = kp), Fp;
}
zn.ngInherit = !0;
function Fp() {
  let t = yl(this),
    e = t?.current;
  if (e) {
    let r = t.previous;
    if (r === On) t.previous = e;
    else for (let n in e) r[n] = e[n];
    (t.current = null), this.ngOnChanges(e);
  }
}
function kp(t, e, r, n) {
  let o = this.declaredInputs[r],
    i = yl(t) || Lp(t, { previous: On, current: null }),
    s = i.current || (i.current = {}),
    a = i.previous,
    c = a[o];
  (s[o] = new Ji(c && c.currentValue, e, a === On)), (t[n] = e);
}
var vl = "__ngSimpleChanges__";
function yl(t) {
  return t[vl] || null;
}
function Lp(t, e) {
  return (t[vl] = e);
}
var Du = null;
var Fe = function (t, e, r) {
    Du?.(t, e, r);
  },
  jp = "svg",
  Vp = "math",
  Up = !1;
function Bp() {
  return Up;
}
function Ve(t) {
  for (; Array.isArray(t); ) t = t[Qe];
  return t;
}
function Hp(t, e) {
  return Ve(e[t]);
}
function ve(t, e) {
  return Ve(e[t.index]);
}
function Dl(t, e) {
  return t.data[e];
}
function ft(t, e) {
  let r = e[t];
  return at(r) ? r : r[Qe];
}
function Ls(t) {
  return (t[D] & 128) === 128;
}
function $p(t) {
  return Me(t[G]);
}
function to(t, e) {
  return e == null ? null : t[e];
}
function Cl(t) {
  t[Zt] = 0;
}
function zp(t) {
  t[D] & 1024 || ((t[D] |= 1024), Ls(t) && kn(t));
}
function Gp(t, e) {
  for (; t > 0; ) (e = e[an]), t--;
  return e;
}
function wl(t) {
  return t[D] & 9216 || t[Mt]?.dirty;
}
function Ki(t) {
  wl(t)
    ? kn(t)
    : t[D] & 64 &&
      (Bp()
        ? ((t[D] |= 1024), kn(t))
        : t[Ye].changeDetectionScheduler?.notify());
}
function kn(t) {
  t[Ye].changeDetectionScheduler?.notify();
  let e = t[G];
  for (
    ;
    e !== null &&
    !((Me(e) && e[D] & tn.HasChildViewsToRefresh) || (at(e) && e[D] & 8192));

  ) {
    if (Me(e)) e[D] |= tn.HasChildViewsToRefresh;
    else if (((e[D] |= 8192), !Ls(e))) break;
    e = e[G];
  }
}
function El(t, e) {
  if ((t[D] & 256) === 256) throw new m(911, !1);
  t[st] === null && (t[st] = []), t[st].push(e);
}
function Wp(t, e) {
  if (t[st] === null) return;
  let r = t[st].indexOf(e);
  r !== -1 && t[st].splice(r, 1);
}
var S = { lFrame: _l(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function qp() {
  return S.lFrame.elementDepthCount;
}
function Zp() {
  S.lFrame.elementDepthCount++;
}
function Yp() {
  S.lFrame.elementDepthCount--;
}
function Il() {
  return S.bindingsEnabled;
}
function Qp() {
  return S.skipHydrationRootTNode !== null;
}
function Jp(t) {
  return S.skipHydrationRootTNode === t;
}
function Kp() {
  S.skipHydrationRootTNode = null;
}
function V() {
  return S.lFrame.lView;
}
function ht() {
  return S.lFrame.tView;
}
function cn(t) {
  return (S.lFrame.contextLView = t), t[be];
}
function un(t) {
  return (S.lFrame.contextLView = null), t;
}
function ye() {
  let t = bl();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function bl() {
  return S.lFrame.currentTNode;
}
function Xp() {
  let t = S.lFrame,
    e = t.currentTNode;
  return t.isParent ? e : e.parent;
}
function Gn(t, e) {
  let r = S.lFrame;
  (r.currentTNode = t), (r.isParent = e);
}
function Ml() {
  return S.lFrame.isParent;
}
function eg() {
  S.lFrame.isParent = !1;
}
function Sl() {
  let t = S.lFrame,
    e = t.bindingRootIndex;
  return e === -1 && (e = t.bindingRootIndex = t.tView.bindingStartIndex), e;
}
function tg(t) {
  return (S.lFrame.bindingIndex = t);
}
function js() {
  return S.lFrame.bindingIndex++;
}
function ng() {
  return S.lFrame.inI18n;
}
function rg(t, e) {
  let r = S.lFrame;
  (r.bindingIndex = r.bindingRootIndex = t), Xi(e);
}
function og() {
  return S.lFrame.currentDirectiveIndex;
}
function Xi(t) {
  S.lFrame.currentDirectiveIndex = t;
}
function xl(t) {
  S.lFrame.currentQueryIndex = t;
}
function ig(t) {
  let e = t[_];
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[Te] : null;
}
function Tl(t, e, r) {
  if (r & M.SkipSelf) {
    let o = e,
      i = t;
    for (; (o = o.parent), o === null && !(r & M.Host); )
      if (((o = ig(i)), o === null || ((i = i[an]), o.type & 10))) break;
    if (o === null) return !1;
    (e = o), (t = i);
  }
  let n = (S.lFrame = Al());
  return (n.currentTNode = e), (n.lView = t), !0;
}
function Vs(t) {
  let e = Al(),
    r = t[_];
  (S.lFrame = e),
    (e.currentTNode = r.firstChild),
    (e.lView = t),
    (e.tView = r),
    (e.contextLView = t),
    (e.bindingIndex = r.bindingStartIndex),
    (e.inI18n = !1);
}
function Al() {
  let t = S.lFrame,
    e = t === null ? null : t.child;
  return e === null ? _l(t) : e;
}
function _l(t) {
  let e = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: t,
    child: null,
    inI18n: !1,
  };
  return t !== null && (t.child = e), e;
}
function Nl() {
  let t = S.lFrame;
  return (S.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var Ol = Nl;
function Us() {
  let t = Nl();
  (t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0);
}
function sg(t) {
  return (S.lFrame.contextLView = Gp(t, S.lFrame.contextLView))[be];
}
function Bs() {
  return S.lFrame.selectedIndex;
}
function xt(t) {
  S.lFrame.selectedIndex = t;
}
function Rl() {
  let t = S.lFrame;
  return Dl(t.tView, t.selectedIndex);
}
function ag() {
  return S.lFrame.currentNamespace;
}
var Pl = !0;
function Hs() {
  return Pl;
}
function $s(t) {
  Pl = t;
}
function cg(t, e, r) {
  let { ngOnChanges: n, ngOnInit: o, ngDoCheck: i } = e.type.prototype;
  if (n) {
    let s = ml(e);
    (r.preOrderHooks ??= []).push(t, s),
      (r.preOrderCheckHooks ??= []).push(t, s);
  }
  o && (r.preOrderHooks ??= []).push(0 - t, o),
    i &&
      ((r.preOrderHooks ??= []).push(t, i),
      (r.preOrderCheckHooks ??= []).push(t, i));
}
function zs(t, e) {
  for (let r = e.directiveStart, n = e.directiveEnd; r < n; r++) {
    let i = t.data[r].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: u,
        ngOnDestroy: l,
      } = i;
    s && (t.contentHooks ??= []).push(-r, s),
      a &&
        ((t.contentHooks ??= []).push(r, a),
        (t.contentCheckHooks ??= []).push(r, a)),
      c && (t.viewHooks ??= []).push(-r, c),
      u &&
        ((t.viewHooks ??= []).push(r, u), (t.viewCheckHooks ??= []).push(r, u)),
      l != null && (t.destroyHooks ??= []).push(r, l);
  }
}
function Gr(t, e, r) {
  Fl(t, e, 3, r);
}
function Wr(t, e, r, n) {
  (t[D] & 3) === r && Fl(t, e, r, n);
}
function Vi(t, e) {
  let r = t[D];
  (r & 3) === e && ((r &= 16383), (r += 1), (t[D] = r));
}
function Fl(t, e, r, n) {
  let o = n !== void 0 ? t[Zt] & 65535 : 0,
    i = n ?? -1,
    s = e.length - 1,
    a = 0;
  for (let c = o; c < s; c++)
    if (typeof e[c + 1] == "number") {
      if (((a = e[c]), n != null && a >= n)) break;
    } else
      e[c] < 0 && (t[Zt] += 65536),
        (a < i || i == -1) &&
          (ug(t, r, e, c), (t[Zt] = (t[Zt] & 4294901760) + c + 2)),
        c++;
}
function Cu(t, e) {
  Fe(4, t, e);
  let r = ae(null);
  try {
    e.call(t);
  } finally {
    ae(r), Fe(5, t, e);
  }
}
function ug(t, e, r, n) {
  let o = r[n] < 0,
    i = r[n + 1],
    s = o ? -r[n] : r[n],
    a = t[s];
  o
    ? t[D] >> 14 < t[Zt] >> 16 &&
      (t[D] & 3) === e &&
      ((t[D] += 16384), Cu(a, i))
    : Cu(a, i);
}
var Xt = -1,
  Ln = class {
    constructor(e, r, n) {
      (this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = r),
        (this.injectImpl = n);
    }
  };
function lg(t) {
  return t instanceof Ln;
}
function dg(t) {
  return (t.flags & 8) !== 0;
}
function fg(t) {
  return (t.flags & 16) !== 0;
}
function kl(t) {
  return t !== Xt;
}
function no(t) {
  let e = t & 32767;
  return t & 32767;
}
function hg(t) {
  return t >> 16;
}
function ro(t, e) {
  let r = hg(t),
    n = e;
  for (; r > 0; ) (n = n[an]), r--;
  return n;
}
var es = !0;
function wu(t) {
  let e = es;
  return (es = t), e;
}
var pg = 256,
  Ll = pg - 1,
  jl = 5,
  gg = 0,
  ke = {};
function mg(t, e, r) {
  let n;
  typeof r == "string"
    ? (n = r.charCodeAt(0) || 0)
    : r.hasOwnProperty(An) && (n = r[An]),
    n == null && (n = r[An] = gg++);
  let o = n & Ll,
    i = 1 << o;
  e.data[t + (o >> jl)] |= i;
}
function Vl(t, e) {
  let r = Ul(t, e);
  if (r !== -1) return r;
  let n = e[_];
  n.firstCreatePass &&
    ((t.injectorIndex = e.length),
    Ui(n.data, t),
    Ui(e, null),
    Ui(n.blueprint, null));
  let o = Gs(t, e),
    i = t.injectorIndex;
  if (kl(o)) {
    let s = no(o),
      a = ro(o, e),
      c = a[_].data;
    for (let u = 0; u < 8; u++) e[i + u] = a[s + u] | c[s + u];
  }
  return (e[i + 8] = o), i;
}
function Ui(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
}
function Ul(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function Gs(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let r = 0,
    n = null,
    o = e;
  for (; o !== null; ) {
    if (((n = Gl(o)), n === null)) return Xt;
    if ((r++, (o = o[an]), n.injectorIndex !== -1))
      return n.injectorIndex | (r << 16);
  }
  return Xt;
}
function vg(t, e, r) {
  mg(t, e, r);
}
function yg(t, e) {
  if (e === "class") return t.classes;
  if (e === "style") return t.styles;
  let r = t.attrs;
  if (r) {
    let n = r.length,
      o = 0;
    for (; o < n; ) {
      let i = r[o];
      if (ol(i)) break;
      if (i === 0) o = o + 2;
      else if (typeof i == "number")
        for (o++; o < n && typeof r[o] == "string"; ) o++;
      else {
        if (i === e) return r[o + 1];
        o = o + 2;
      }
    }
  }
  return null;
}
function Bl(t, e, r) {
  if (r & M.Optional || t !== void 0) return t;
  Ps(e, "NodeInjector");
}
function Hl(t, e, r, n) {
  if (
    (r & M.Optional && n === void 0 && (n = null), !(r & (M.Self | M.Host)))
  ) {
    let o = t[en],
      i = pe(void 0);
    try {
      return o ? o.get(e, n, r & M.Optional) : el(e, n, r & M.Optional);
    } finally {
      pe(i);
    }
  }
  return Bl(n, e, r);
}
function $l(t, e, r, n = M.Default, o) {
  if (t !== null) {
    if (e[D] & 2048 && !(n & M.Self)) {
      let s = Ig(t, e, r, n, ke);
      if (s !== ke) return s;
    }
    let i = zl(t, e, r, n, ke);
    if (i !== ke) return i;
  }
  return Hl(e, r, n, o);
}
function zl(t, e, r, n, o) {
  let i = wg(r);
  if (typeof i == "function") {
    if (!Tl(e, t, n)) return n & M.Host ? Bl(o, r, n) : Hl(e, r, n, o);
    try {
      let s;
      if (((s = i(n)), s == null && !(n & M.Optional))) Ps(r);
      else return s;
    } finally {
      Ol();
    }
  } else if (typeof i == "number") {
    let s = null,
      a = Ul(t, e),
      c = Xt,
      u = n & M.Host ? e[je][Te] : null;
    for (
      (a === -1 || n & M.SkipSelf) &&
      ((c = a === -1 ? Gs(t, e) : e[a + 8]),
      c === Xt || !Iu(n, !1)
        ? (a = -1)
        : ((s = e[_]), (a = no(c)), (e = ro(c, e))));
      a !== -1;

    ) {
      let l = e[_];
      if (Eu(i, a, l.data)) {
        let d = Dg(a, e, r, s, n, u);
        if (d !== ke) return d;
      }
      (c = e[a + 8]),
        c !== Xt && Iu(n, e[_].data[a + 8] === u) && Eu(i, a, e)
          ? ((s = l), (a = no(c)), (e = ro(c, e)))
          : (a = -1);
    }
  }
  return o;
}
function Dg(t, e, r, n, o, i) {
  let s = e[_],
    a = s.data[t + 8],
    c = n == null ? Eo(a) && es : n != s && (a.type & 3) !== 0,
    u = o & M.Host && i === a,
    l = Cg(a, s, r, c, u);
  return l !== null ? jn(e, s, l, a) : ke;
}
function Cg(t, e, r, n, o) {
  let i = t.providerIndexes,
    s = e.data,
    a = i & 1048575,
    c = t.directiveStart,
    u = t.directiveEnd,
    l = i >> 20,
    d = n ? a : a + l,
    f = o ? a + l : u;
  for (let h = d; h < f; h++) {
    let w = s[h];
    if ((h < c && r === w) || (h >= c && w.type === r)) return h;
  }
  if (o) {
    let h = s[c];
    if (h && $n(h) && h.type === r) return c;
  }
  return null;
}
function jn(t, e, r, n) {
  let o = t[r],
    i = e.data;
  if (lg(o)) {
    let s = o;
    s.resolving && sp(ip(i[r]));
    let a = wu(s.canSeeViewProviders);
    s.resolving = !0;
    let c,
      u = s.injectImpl ? pe(s.injectImpl) : null,
      l = Tl(t, n, M.Default);
    try {
      (o = t[r] = s.factory(void 0, i, t, n)),
        e.firstCreatePass && r >= n.directiveStart && cg(r, i[r], e);
    } finally {
      u !== null && pe(u), wu(a), (s.resolving = !1), Ol();
    }
  }
  return o;
}
function wg(t) {
  if (typeof t == "string") return t.charCodeAt(0) || 0;
  let e = t.hasOwnProperty(An) ? t[An] : void 0;
  return typeof e == "number" ? (e >= 0 ? e & Ll : Eg) : e;
}
function Eu(t, e, r) {
  let n = 1 << t;
  return !!(r[e + (t >> jl)] & n);
}
function Iu(t, e) {
  return !(t & M.Self) && !(t & M.Host && e);
}
var bt = class {
  constructor(e, r) {
    (this._tNode = e), (this._lView = r);
  }
  get(e, r, n) {
    return $l(this._tNode, this._lView, e, Do(n), r);
  }
};
function Eg() {
  return new bt(ye(), V());
}
function Ws(t) {
  return Hn(() => {
    let e = t.prototype.constructor,
      r = e[Qr] || ts(e),
      n = Object.prototype,
      o = Object.getPrototypeOf(t.prototype).constructor;
    for (; o && o !== n; ) {
      let i = o[Qr] || ts(o);
      if (i && i !== r) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function ts(t) {
  return qu(t)
    ? () => {
        let e = ts(ge(t));
        return e && e();
      }
    : nn(t);
}
function Ig(t, e, r, n, o) {
  let i = t,
    s = e;
  for (; i !== null && s !== null && s[D] & 2048 && !(s[D] & 512); ) {
    let a = zl(i, s, r, n | M.Self, ke);
    if (a !== ke) return a;
    let c = i.parent;
    if (!c) {
      let u = s[hl];
      if (u) {
        let l = u.get(r, ke, n);
        if (l !== ke) return l;
      }
      (c = Gl(s)), (s = s[an]);
    }
    i = c;
  }
  return o;
}
function Gl(t) {
  let e = t[_],
    r = e.type;
  return r === 2 ? e.declTNode : r === 1 ? t[Te] : null;
}
function qs(t) {
  return yg(ye(), t);
}
var Hr = "__parameters__";
function bg(t) {
  return function (...r) {
    if (t) {
      let n = t(...r);
      for (let o in n) this[o] = n[o];
    }
  };
}
function Wl(t, e, r) {
  return Hn(() => {
    let n = bg(e);
    function o(...i) {
      if (this instanceof o) return n.apply(this, i), this;
      let s = new o(...i);
      return (a.annotation = s), a;
      function a(c, u, l) {
        let d = c.hasOwnProperty(Hr)
          ? c[Hr]
          : Object.defineProperty(c, Hr, { value: [] })[Hr];
        for (; d.length <= l; ) d.push(null);
        return (d[l] = d[l] || []).push(s), c;
      }
    }
    return (
      r && (o.prototype = Object.create(r.prototype)),
      (o.prototype.ngMetadataName = t),
      (o.annotationCls = o),
      o
    );
  });
}
function Mg(t) {
  let e = te.ng;
  if (e && e.ɵcompilerFacade) return e.ɵcompilerFacade;
  throw new Error("JIT compiler unavailable");
}
function Sg(t) {
  return typeof t == "function";
}
function Zs(t, e) {
  t.forEach((r) => (Array.isArray(r) ? Zs(r, e) : e(r)));
}
function ql(t, e, r) {
  e >= t.length ? t.push(r) : t.splice(e, 0, r);
}
function oo(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
}
function xg(t, e) {
  let r = [];
  for (let n = 0; n < t; n++) r.push(e);
  return r;
}
var Wn = tl(Wl("Optional"), 8);
var Io = tl(Wl("SkipSelf"), 4);
function Tg(t) {
  let e = [],
    r = new Map();
  function n(o) {
    let i = r.get(o);
    if (!i) {
      let s = t(o);
      r.set(o, (i = s.then(Og)));
    }
    return i;
  }
  return (
    io.forEach((o, i) => {
      let s = [];
      o.templateUrl &&
        s.push(
          n(o.templateUrl).then((u) => {
            o.template = u;
          })
        );
      let a = typeof o.styles == "string" ? [o.styles] : o.styles || [];
      if (((o.styles = a), o.styleUrl && o.styleUrls?.length))
        throw new Error(
          "@Component cannot define both `styleUrl` and `styleUrls`. Use `styleUrl` if the component has one stylesheet, or `styleUrls` if it has multiple"
        );
      if (o.styleUrls?.length) {
        let u = o.styles.length,
          l = o.styleUrls;
        o.styleUrls.forEach((d, f) => {
          a.push(""),
            s.push(
              n(d).then((h) => {
                (a[u + f] = h),
                  l.splice(l.indexOf(d), 1),
                  l.length == 0 && (o.styleUrls = void 0);
              })
            );
        });
      } else
        o.styleUrl &&
          s.push(
            n(o.styleUrl).then((u) => {
              a.push(u), (o.styleUrl = void 0);
            })
          );
      let c = Promise.all(s).then(() => Rg(i));
      e.push(c);
    }),
    _g(),
    Promise.all(e).then(() => {})
  );
}
var io = new Map(),
  Ag = new Set();
function _g() {
  let t = io;
  return (io = new Map()), t;
}
function Ng() {
  return io.size === 0;
}
function Og(t) {
  return typeof t == "string" ? t : t.text();
}
function Rg(t) {
  Ag.delete(t);
}
var rn = new I("ENVIRONMENT_INITIALIZER"),
  Zl = new I("INJECTOR", -1),
  Yl = new I("INJECTOR_DEF_TYPES"),
  so = class {
    get(e, r = Nn) {
      if (r === Nn) {
        let n = new Error(`NullInjectorError: No provider for ${ee(e)}!`);
        throw ((n.name = "NullInjectorError"), n);
      }
      return r;
    }
  };
function Pg(...t) {
  return { ɵproviders: Ql(!0, t), ɵfromNgModule: !0 };
}
function Ql(t, ...e) {
  let r = [],
    n = new Set(),
    o,
    i = (s) => {
      r.push(s);
    };
  return (
    Zs(e, (s) => {
      let a = s;
      ns(a, i, [], n) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && Jl(o, i),
    r
  );
}
function Jl(t, e) {
  for (let r = 0; r < t.length; r++) {
    let { ngModule: n, providers: o } = t[r];
    Ys(o, (i) => {
      e(i, n);
    });
  }
}
function ns(t, e, r, n) {
  if (((t = ge(t)), !t)) return !1;
  let o = null,
    i = du(t),
    s = !i && ct(t);
  if (!i && !s) {
    let c = t.ngModule;
    if (((i = du(c)), i)) o = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    o = t;
  }
  let a = n.has(o);
  if (s) {
    if (a) return !1;
    if ((n.add(o), s.dependencies)) {
      let c =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let u of c) ns(u, e, r, n);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      n.add(o);
      let u;
      try {
        Zs(i.imports, (l) => {
          ns(l, e, r, n) && ((u ||= []), u.push(l));
        });
      } finally {
      }
      u !== void 0 && Jl(u, e);
    }
    if (!a) {
      let u = nn(o) || (() => new o());
      e({ provide: o, useFactory: u, deps: Pe }, o),
        e({ provide: Yl, useValue: o, multi: !0 }, o),
        e({ provide: rn, useValue: () => v(o), multi: !0 }, o);
    }
    let c = i.providers;
    if (c != null && !a) {
      let u = t;
      Ys(c, (l) => {
        e(l, u);
      });
    }
  } else return !1;
  return o !== t && t.providers !== void 0;
}
function Ys(t, e) {
  for (let r of t)
    Zu(r) && (r = r.ɵproviders), Array.isArray(r) ? Ys(r, e) : e(r);
}
var Fg = P({ provide: String, useValue: P });
function Kl(t) {
  return t !== null && typeof t == "object" && Fg in t;
}
function kg(t) {
  return !!(t && t.useExisting);
}
function Lg(t) {
  return !!(t && t.useFactory);
}
function rs(t) {
  return typeof t == "function";
}
var bo = new I("Set Injector scope."),
  qr = {},
  jg = {},
  Bi;
function Qs() {
  return Bi === void 0 && (Bi = new so()), Bi;
}
var ue = class {},
  Vn = class extends ue {
    get destroyed() {
      return this._destroyed;
    }
    constructor(e, r, n, o) {
      super(),
        (this.parent = r),
        (this.source = n),
        (this.scopes = o),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        is(e, (s) => this.processProvider(s)),
        this.records.set(Zl, Yt(void 0, this)),
        o.has("environment") && this.records.set(ue, Yt(void 0, this));
      let i = this.records.get(bo);
      i != null && typeof i.value == "string" && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(Yl, Pe, M.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let e = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of e) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear();
      }
    }
    onDestroy(e) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(e),
        () => this.removeOnDestroy(e)
      );
    }
    runInContext(e) {
      this.assertNotDestroyed();
      let r = it(this),
        n = pe(void 0),
        o;
      try {
        return e();
      } finally {
        it(r), pe(n);
      }
    }
    get(e, r = Nn, n = M.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(uu))) return e[uu](this);
      n = Do(n);
      let o,
        i = it(this),
        s = pe(void 0);
      try {
        if (!(n & M.SkipSelf)) {
          let c = this.records.get(e);
          if (c === void 0) {
            let u = zg(e) && yo(e);
            u && this.injectableDefInScope(u)
              ? (c = Yt(os(e), qr))
              : (c = null),
              this.records.set(e, c);
          }
          if (c != null) return this.hydrate(e, c);
        }
        let a = n & M.Self ? Qs() : this.parent;
        return (r = n & M.Optional && r === Nn ? null : r), a.get(e, r);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[Jr] = a[Jr] || []).unshift(ee(e)), i)) throw a;
          return yp(a, e, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        pe(s), it(i);
      }
    }
    resolveInjectorInitializers() {
      let e = it(this),
        r = pe(void 0),
        n;
      try {
        let o = this.get(rn, Pe, M.Self);
        for (let i of o) i();
      } finally {
        it(e), pe(r);
      }
    }
    toString() {
      let e = [],
        r = this.records;
      for (let n of r.keys()) e.push(ee(n));
      return `R3Injector[${e.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new m(205, !1);
    }
    processProvider(e) {
      e = ge(e);
      let r = rs(e) ? e : ge(e && e.provide),
        n = Ug(e);
      if (!rs(e) && e.multi === !0) {
        let o = this.records.get(r);
        o ||
          ((o = Yt(void 0, qr, !0)),
          (o.factory = () => Yi(o.multi)),
          this.records.set(r, o)),
          (r = e),
          o.multi.push(e);
      } else {
        let o = this.records.get(r);
      }
      this.records.set(r, n);
    }
    hydrate(e, r) {
      return (
        r.value === qr && ((r.value = jg), (r.value = r.factory())),
        typeof r.value == "object" &&
          r.value &&
          $g(r.value) &&
          this._ngOnDestroyHooks.add(r.value),
        r.value
      );
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1;
      let r = ge(e.providedIn);
      return typeof r == "string"
        ? r === "any" || this.scopes.has(r)
        : this.injectorDefTypes.has(r);
    }
    removeOnDestroy(e) {
      let r = this._onDestroyHooks.indexOf(e);
      r !== -1 && this._onDestroyHooks.splice(r, 1);
    }
  };
function os(t) {
  let e = yo(t),
    r = e !== null ? e.factory : nn(t);
  if (r !== null) return r;
  if (t instanceof I) throw new m(204, !1);
  if (t instanceof Function) return Vg(t);
  throw new m(204, !1);
}
function Vg(t) {
  let e = t.length;
  if (e > 0) {
    let n = xg(e, "?");
    throw new m(204, !1);
  }
  let r = up(t);
  return r !== null ? () => r.factory(t) : () => new t();
}
function Ug(t) {
  if (Kl(t)) return Yt(void 0, t.useValue);
  {
    let e = Bg(t);
    return Yt(e, qr);
  }
}
function Bg(t, e, r) {
  let n;
  if (rs(t)) {
    let o = ge(t);
    return nn(o) || os(o);
  } else if (Kl(t)) n = () => ge(t.useValue);
  else if (Lg(t)) n = () => t.useFactory(...Yi(t.deps || []));
  else if (kg(t)) n = () => v(ge(t.useExisting));
  else {
    let o = ge(t && (t.useClass || t.provide));
    if (Hg(t)) n = () => new o(...Yi(t.deps));
    else return nn(o) || os(o);
  }
  return n;
}
function Yt(t, e, r = !1) {
  return { factory: t, value: e, multi: r ? [] : void 0 };
}
function Hg(t) {
  return !!t.deps;
}
function $g(t) {
  return (
    t !== null && typeof t == "object" && typeof t.ngOnDestroy == "function"
  );
}
function zg(t) {
  return typeof t == "function" || (typeof t == "object" && t instanceof I);
}
function is(t, e) {
  for (let r of t)
    Array.isArray(r) ? is(r, e) : r && Zu(r) ? is(r.ɵproviders, e) : e(r);
}
function pt(t, e) {
  t instanceof Vn && t.assertNotDestroyed();
  let r,
    n = it(t),
    o = pe(void 0);
  try {
    return e();
  } finally {
    it(n), pe(o);
  }
}
function Gg(t) {
  if (!Xu() && !gp()) throw new m(-203, !1);
}
function bu(t, e = null, r = null, n) {
  let o = Xl(t, e, r, n);
  return o.resolveInjectorInitializers(), o;
}
function Xl(t, e = null, r = null, n, o = new Set()) {
  let i = [r || Pe, Pg(t)];
  return (
    (n = n || (typeof t == "object" ? void 0 : ee(t))),
    new Vn(i, e || Qs(), n || null, o)
  );
}
var Ae = (() => {
  let e = class e {
    static create(n, o) {
      if (Array.isArray(n)) return bu({ name: "" }, o, n, "");
      {
        let i = n.name ?? "";
        return bu({ name: i }, n.parent, n.providers, i);
      }
    }
  };
  (e.THROW_IF_NOT_FOUND = Nn),
    (e.NULL = new so()),
    (e.ɵprov = y({ token: e, providedIn: "any", factory: () => v(Zl) })),
    (e.__NG_ELEMENT_ID__ = -1);
  let t = e;
  return t;
})();
var ss;
function ed(t) {
  ss = t;
}
function Wg() {
  if (ss !== void 0) return ss;
  if (typeof document < "u") return document;
  throw new m(210, !1);
}
var Mo = new I("AppId", { providedIn: "root", factory: () => qg }),
  qg = "ng",
  Js = new I("Platform Initializer"),
  _t = new I("Platform ID", {
    providedIn: "platform",
    factory: () => "unknown",
  });
var Ks = new I("CSP nonce", {
  providedIn: "root",
  factory: () =>
    Wg().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
function td(t) {
  return t instanceof Function ? t() : t;
}
function Zg(t) {
  return (t ?? p(Ae)).get(_t) === "browser";
}
function nd(t) {
  return (t.flags & 128) === 128;
}
var gt = (function (t) {
  return (
    (t[(t.Important = 1)] = "Important"), (t[(t.DashCase = 2)] = "DashCase"), t
  );
})(gt || {});
var rd = new Map(),
  Yg = 0;
function Qg() {
  return Yg++;
}
function Jg(t) {
  rd.set(t[wo], t);
}
function Kg(t) {
  rd.delete(t[wo]);
}
var Mu = "__ngContext__";
function Tt(t, e) {
  at(e) ? ((t[Mu] = e[wo]), Jg(e)) : (t[Mu] = e);
}
var Xg;
function Xs(t, e) {
  return Xg(t, e);
}
function ea(t) {
  let e = t[G];
  return Me(e) ? e[G] : e;
}
function od(t) {
  return sd(t[Pn]);
}
function id(t) {
  return sd(t[Ie]);
}
function sd(t) {
  for (; t !== null && !Me(t); ) t = t[Ie];
  return t;
}
function Qt(t, e, r, n, o) {
  if (n != null) {
    let i,
      s = !1;
    Me(n) ? (i = n) : at(n) && ((s = !0), (n = n[Qe]));
    let a = Ve(n);
    t === 0 && r !== null
      ? o == null
        ? ld(e, r, a)
        : ao(e, r, a, o || null, !0)
      : t === 1 && r !== null
      ? ao(e, r, a, o || null, !0)
      : t === 2
      ? vm(e, a, s)
      : t === 3 && e.destroyNode(a),
      i != null && Dm(e, t, i, r, o);
  }
}
function em(t, e) {
  return t.createText(e);
}
function tm(t, e, r) {
  t.setValue(e, r);
}
function ad(t, e, r) {
  return t.createElement(e, r);
}
function nm(t, e) {
  let r = e[J];
  qn(t, e, r, 2, null, null), (e[Qe] = null), (e[Te] = null);
}
function rm(t, e, r, n, o, i) {
  (n[Qe] = o), (n[Te] = e), qn(t, n, r, 1, o, i);
}
function om(t, e) {
  qn(t, e, e[J], 2, null, null);
}
function im(t) {
  let e = t[Pn];
  if (!e) return Hi(t[_], t);
  for (; e; ) {
    let r = null;
    if (at(e)) r = e[Pn];
    else {
      let n = e[me];
      n && (r = n);
    }
    if (!r) {
      for (; e && !e[Ie] && e !== t; ) at(e) && Hi(e[_], e), (e = e[G]);
      e === null && (e = t), at(e) && Hi(e[_], e), (r = e && e[Ie]);
    }
    e = r;
  }
}
function sm(t, e, r, n) {
  let o = me + n,
    i = r.length;
  n > 0 && (r[o - 1][Ie] = e),
    n < i - me
      ? ((e[Ie] = r[o]), ql(r, me + n, e))
      : (r.push(e), (e[Ie] = null)),
    (e[G] = r);
  let s = e[Co];
  s !== null && r !== s && am(s, e);
  let a = e[Fn];
  a !== null && a.insertView(t), Ki(e), (e[D] |= 128);
}
function am(t, e) {
  let r = t[eo],
    o = e[G][G][je];
  e[je] !== o && (t[D] |= tn.HasTransplantedViews),
    r === null ? (t[eo] = [e]) : r.push(e);
}
function cd(t, e) {
  let r = t[eo],
    n = r.indexOf(e),
    o = e[G];
  r.splice(n, 1);
}
function as(t, e) {
  if (t.length <= me) return;
  let r = me + e,
    n = t[r];
  if (n) {
    let o = n[Co];
    o !== null && o !== t && cd(o, n), e > 0 && (t[r - 1][Ie] = n[Ie]);
    let i = oo(t, me + e);
    nm(n[_], n);
    let s = i[Fn];
    s !== null && s.detachView(i[_]),
      (n[G] = null),
      (n[Ie] = null),
      (n[D] &= -129);
  }
  return n;
}
function ud(t, e) {
  if (!(e[D] & 256)) {
    let r = e[J];
    r.destroyNode && qn(t, e, r, 3, null, null), im(e);
  }
}
function Hi(t, e) {
  if (!(e[D] & 256)) {
    (e[D] &= -129),
      (e[D] |= 256),
      e[Mt] && Oc(e[Mt]),
      um(t, e),
      cm(t, e),
      e[_].type === 1 && e[J].destroy();
    let r = e[Co];
    if (r !== null && Me(e[G])) {
      r !== e[G] && cd(r, e);
      let n = e[Fn];
      n !== null && n.detachView(t);
    }
    Kg(e);
  }
}
function cm(t, e) {
  let r = t.cleanup,
    n = e[Rn];
  if (r !== null)
    for (let i = 0; i < r.length - 1; i += 2)
      if (typeof r[i] == "string") {
        let s = r[i + 3];
        s >= 0 ? n[s]() : n[-s].unsubscribe(), (i += 2);
      } else {
        let s = n[r[i + 1]];
        r[i].call(s);
      }
  n !== null && (e[Rn] = null);
  let o = e[st];
  if (o !== null) {
    e[st] = null;
    for (let i = 0; i < o.length; i++) {
      let s = o[i];
      s();
    }
  }
}
function um(t, e) {
  let r;
  if (t != null && (r = t.destroyHooks) != null)
    for (let n = 0; n < r.length; n += 2) {
      let o = e[r[n]];
      if (!(o instanceof Ln)) {
        let i = r[n + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              c = i[s + 1];
            Fe(4, a, c);
            try {
              c.call(a);
            } finally {
              Fe(5, a, c);
            }
          }
        else {
          Fe(4, o, i);
          try {
            i.call(o);
          } finally {
            Fe(5, o, i);
          }
        }
      }
    }
}
function lm(t, e, r) {
  return dm(t, e.parent, r);
}
function dm(t, e, r) {
  let n = e;
  for (; n !== null && n.type & 40; ) (e = n), (n = e.parent);
  if (n === null) return r[Qe];
  {
    let { componentOffset: o } = n;
    if (o > -1) {
      let { encapsulation: i } = t.data[n.directiveStart + o];
      if (i === Le.None || i === Le.Emulated) return null;
    }
    return ve(n, r);
  }
}
function ao(t, e, r, n, o) {
  t.insertBefore(e, r, n, o);
}
function ld(t, e, r) {
  t.appendChild(e, r);
}
function Su(t, e, r, n, o) {
  n !== null ? ao(t, e, r, n, o) : ld(t, e, r);
}
function fm(t, e, r, n) {
  t.removeChild(e, r, n);
}
function ta(t, e) {
  return t.parentNode(e);
}
function hm(t, e) {
  return t.nextSibling(e);
}
function pm(t, e, r) {
  return mm(t, e, r);
}
function gm(t, e, r) {
  return t.type & 40 ? ve(t, r) : null;
}
var mm = gm,
  xu;
function na(t, e, r, n) {
  let o = lm(t, n, e),
    i = e[J],
    s = n.parent || e[Te],
    a = pm(s, n, e);
  if (o != null)
    if (Array.isArray(r))
      for (let c = 0; c < r.length; c++) Su(i, o, r[c], a, !1);
    else Su(i, o, r, a, !1);
  xu !== void 0 && xu(i, n, e, r, o);
}
function Zr(t, e) {
  if (e !== null) {
    let r = e.type;
    if (r & 3) return ve(e, t);
    if (r & 4) return cs(-1, t[e.index]);
    if (r & 8) {
      let n = e.child;
      if (n !== null) return Zr(t, n);
      {
        let o = t[e.index];
        return Me(o) ? cs(-1, o) : Ve(o);
      }
    } else {
      if (r & 32) return Xs(e, t)() || Ve(t[e.index]);
      {
        let n = dd(t, e);
        if (n !== null) {
          if (Array.isArray(n)) return n[0];
          let o = ea(t[je]);
          return Zr(o, n);
        } else return Zr(t, e.next);
      }
    }
  }
  return null;
}
function dd(t, e) {
  if (e !== null) {
    let n = t[je][Te],
      o = e.projection;
    return n.projection[o];
  }
  return null;
}
function cs(t, e) {
  let r = me + t + 1;
  if (r < e.length) {
    let n = e[r],
      o = n[_].firstChild;
    if (o !== null) return Zr(n, o);
  }
  return e[St];
}
function vm(t, e, r) {
  let n = ta(t, e);
  n && fm(t, n, e, r);
}
function ra(t, e, r, n, o, i, s) {
  for (; r != null; ) {
    let a = n[r.index],
      c = r.type;
    if (
      (s && e === 0 && (a && Tt(Ve(a), n), (r.flags |= 2)),
      (r.flags & 32) !== 32)
    )
      if (c & 8) ra(t, e, r.child, n, o, i, !1), Qt(e, t, o, a, i);
      else if (c & 32) {
        let u = Xs(r, n),
          l;
        for (; (l = u()); ) Qt(e, t, o, l, i);
        Qt(e, t, o, a, i);
      } else c & 16 ? ym(t, e, n, r, o, i) : Qt(e, t, o, a, i);
    r = s ? r.projectionNext : r.next;
  }
}
function qn(t, e, r, n, o, i) {
  ra(r, n, t.firstChild, e, o, i, !1);
}
function ym(t, e, r, n, o, i) {
  let s = r[je],
    c = s[Te].projection[n.projection];
  if (Array.isArray(c))
    for (let u = 0; u < c.length; u++) {
      let l = c[u];
      Qt(e, t, o, l, i);
    }
  else {
    let u = c,
      l = s[G];
    nd(n) && (u.flags |= 128), ra(t, e, u, l, o, i, !0);
  }
}
function Dm(t, e, r, n, o) {
  let i = r[St],
    s = Ve(r);
  i !== s && Qt(e, t, n, i, o);
  for (let a = me; a < r.length; a++) {
    let c = r[a];
    qn(c[_], c, t, e, n, i);
  }
}
function Cm(t, e, r) {
  t.setAttribute(e, "style", r);
}
function fd(t, e, r) {
  r === "" ? t.removeAttribute(e, "class") : t.setAttribute(e, "class", r);
}
function hd(t, e, r) {
  let { mergedAttrs: n, classes: o, styles: i } = r;
  n !== null && Qi(t, e, n),
    o !== null && fd(t, e, o),
    i !== null && Cm(t, e, i);
}
var $r;
function wm() {
  if ($r === void 0 && (($r = null), te.trustedTypes))
    try {
      $r = te.trustedTypes.createPolicy("angular#unsafe-bypass", {
        createHTML: (t) => t,
        createScript: (t) => t,
        createScriptURL: (t) => t,
      });
    } catch {}
  return $r;
}
function Tu(t) {
  return wm()?.createScriptURL(t) || t;
}
var co = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Yu})`;
  }
};
function So(t) {
  return t instanceof co ? t.changingThisBreaksApplicationSecurity : t;
}
function oa(t, e) {
  let r = Em(t);
  if (r != null && r !== e) {
    if (r === "ResourceURL" && e === "URL") return !0;
    throw new Error(`Required a safe ${e}, got a ${r} (see ${Yu})`);
  }
  return r === e;
}
function Em(t) {
  return (t instanceof co && t.getTypeName()) || null;
}
var Im = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function pd(t) {
  return (t = String(t)), t.match(Im) ? t : "unsafe:" + t;
}
var xo = (function (t) {
  return (
    (t[(t.NONE = 0)] = "NONE"),
    (t[(t.HTML = 1)] = "HTML"),
    (t[(t.STYLE = 2)] = "STYLE"),
    (t[(t.SCRIPT = 3)] = "SCRIPT"),
    (t[(t.URL = 4)] = "URL"),
    (t[(t.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    t
  );
})(xo || {});
function bm(t) {
  let e = md();
  return e ? e.sanitize(xo.URL, t) || "" : oa(t, "URL") ? So(t) : pd(vo(t));
}
function Mm(t) {
  let e = md();
  if (e) return Tu(e.sanitize(xo.RESOURCE_URL, t) || "");
  if (oa(t, "ResourceURL")) return Tu(So(t));
  throw new m(904, !1);
}
function Sm(t, e) {
  return (e === "src" &&
    (t === "embed" ||
      t === "frame" ||
      t === "iframe" ||
      t === "media" ||
      t === "script")) ||
    (e === "href" && (t === "base" || t === "link"))
    ? Mm
    : bm;
}
function gd(t, e, r) {
  return Sm(e, r)(t);
}
function md() {
  let t = V();
  return t && t[Ye].sanitizer;
}
var us = class {};
var xm = "h",
  Tm = "b";
var Am = (t, e, r) => null;
function ia(t, e, r = !1) {
  return Am(t, e, r);
}
var ls = class {},
  uo = class {};
function _m(t) {
  let e = Error(`No component factory found for ${ee(t)}.`);
  return (e[Nm] = t), e;
}
var Nm = "ngComponent";
var ds = class {
    resolveComponentFactory(e) {
      throw _m(e);
    }
  },
  To = (() => {
    let e = class e {};
    e.NULL = new ds();
    let t = e;
    return t;
  })();
function Om() {
  return Ao(ye(), V());
}
function Ao(t, e) {
  return new Nt(ve(t, e));
}
var Nt = (() => {
  let e = class e {
    constructor(n) {
      this.nativeElement = n;
    }
  };
  e.__NG_ELEMENT_ID__ = Om;
  let t = e;
  return t;
})();
var Un = class {},
  ln = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null;
      }
    };
    e.__NG_ELEMENT_ID__ = () => Rm();
    let t = e;
    return t;
  })();
function Rm() {
  let t = V(),
    e = ye(),
    r = ft(e.index, t);
  return (at(r) ? r : t)[J];
}
var Pm = (() => {
    let e = class e {};
    e.ɵprov = y({ token: e, providedIn: "root", factory: () => null });
    let t = e;
    return t;
  })(),
  $i = {};
function vd(t) {
  return sa(t)
    ? Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t)
    : !1;
}
function Fm(t, e) {
  if (Array.isArray(t)) for (let r = 0; r < t.length; r++) e(t[r]);
  else {
    let r = t[Symbol.iterator](),
      n;
    for (; !(n = r.next()).done; ) e(n.value);
  }
}
function sa(t) {
  return t !== null && (typeof t == "function" || typeof t == "object");
}
var fs = class {
    constructor() {}
    supports(e) {
      return vd(e);
    }
    create(e) {
      return new hs(e);
    }
  },
  km = (t, e) => e,
  hs = class {
    constructor(e) {
      (this.length = 0),
        (this._linkedRecords = null),
        (this._unlinkedRecords = null),
        (this._previousItHead = null),
        (this._itHead = null),
        (this._itTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._movesHead = null),
        (this._movesTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null),
        (this._identityChangesHead = null),
        (this._identityChangesTail = null),
        (this._trackByFn = e || km);
    }
    forEachItem(e) {
      let r;
      for (r = this._itHead; r !== null; r = r._next) e(r);
    }
    forEachOperation(e) {
      let r = this._itHead,
        n = this._removalsHead,
        o = 0,
        i = null;
      for (; r || n; ) {
        let s = !n || (r && r.currentIndex < Au(n, o, i)) ? r : n,
          a = Au(s, o, i),
          c = s.currentIndex;
        if (s === n) o--, (n = n._nextRemoved);
        else if (((r = r._next), s.previousIndex == null)) o++;
        else {
          i || (i = []);
          let u = a - o,
            l = c - o;
          if (u != l) {
            for (let f = 0; f < u; f++) {
              let h = f < i.length ? i[f] : (i[f] = 0),
                w = h + f;
              l <= w && w < u && (i[f] = h + 1);
            }
            let d = s.previousIndex;
            i[d] = l - u;
          }
        }
        a !== c && e(s, a, c);
      }
    }
    forEachPreviousItem(e) {
      let r;
      for (r = this._previousItHead; r !== null; r = r._nextPrevious) e(r);
    }
    forEachAddedItem(e) {
      let r;
      for (r = this._additionsHead; r !== null; r = r._nextAdded) e(r);
    }
    forEachMovedItem(e) {
      let r;
      for (r = this._movesHead; r !== null; r = r._nextMoved) e(r);
    }
    forEachRemovedItem(e) {
      let r;
      for (r = this._removalsHead; r !== null; r = r._nextRemoved) e(r);
    }
    forEachIdentityChange(e) {
      let r;
      for (r = this._identityChangesHead; r !== null; r = r._nextIdentityChange)
        e(r);
    }
    diff(e) {
      if ((e == null && (e = []), !vd(e))) throw new m(900, !1);
      return this.check(e) ? this : null;
    }
    onDestroy() {}
    check(e) {
      this._reset();
      let r = this._itHead,
        n = !1,
        o,
        i,
        s;
      if (Array.isArray(e)) {
        this.length = e.length;
        for (let a = 0; a < this.length; a++)
          (i = e[a]),
            (s = this._trackByFn(a, i)),
            r === null || !Object.is(r.trackById, s)
              ? ((r = this._mismatch(r, i, s, a)), (n = !0))
              : (n && (r = this._verifyReinsertion(r, i, s, a)),
                Object.is(r.item, i) || this._addIdentityChange(r, i)),
            (r = r._next);
      } else
        (o = 0),
          Fm(e, (a) => {
            (s = this._trackByFn(o, a)),
              r === null || !Object.is(r.trackById, s)
                ? ((r = this._mismatch(r, a, s, o)), (n = !0))
                : (n && (r = this._verifyReinsertion(r, a, s, o)),
                  Object.is(r.item, a) || this._addIdentityChange(r, a)),
              (r = r._next),
              o++;
          }),
          (this.length = o);
      return this._truncate(r), (this.collection = e), this.isDirty;
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let e;
        for (e = this._previousItHead = this._itHead; e !== null; e = e._next)
          e._nextPrevious = e._next;
        for (e = this._additionsHead; e !== null; e = e._nextAdded)
          e.previousIndex = e.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, e = this._movesHead;
          e !== null;
          e = e._nextMoved
        )
          e.previousIndex = e.currentIndex;
        (this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null);
      }
    }
    _mismatch(e, r, n, o) {
      let i;
      return (
        e === null ? (i = this._itTail) : ((i = e._prev), this._remove(e)),
        (e =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(n, null)),
        e !== null
          ? (Object.is(e.item, r) || this._addIdentityChange(e, r),
            this._reinsertAfter(e, i, o))
          : ((e =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(n, o)),
            e !== null
              ? (Object.is(e.item, r) || this._addIdentityChange(e, r),
                this._moveAfter(e, i, o))
              : (e = this._addAfter(new ps(r, n), i, o))),
        e
      );
    }
    _verifyReinsertion(e, r, n, o) {
      let i =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(n, null);
      return (
        i !== null
          ? (e = this._reinsertAfter(i, e._prev, o))
          : e.currentIndex != o &&
            ((e.currentIndex = o), this._addToMoves(e, o)),
        e
      );
    }
    _truncate(e) {
      for (; e !== null; ) {
        let r = e._next;
        this._addToRemovals(this._unlink(e)), (e = r);
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null);
    }
    _reinsertAfter(e, r, n) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(e);
      let o = e._prevRemoved,
        i = e._nextRemoved;
      return (
        o === null ? (this._removalsHead = i) : (o._nextRemoved = i),
        i === null ? (this._removalsTail = o) : (i._prevRemoved = o),
        this._insertAfter(e, r, n),
        this._addToMoves(e, n),
        e
      );
    }
    _moveAfter(e, r, n) {
      return (
        this._unlink(e), this._insertAfter(e, r, n), this._addToMoves(e, n), e
      );
    }
    _addAfter(e, r, n) {
      return (
        this._insertAfter(e, r, n),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = e)
          : (this._additionsTail = this._additionsTail._nextAdded = e),
        e
      );
    }
    _insertAfter(e, r, n) {
      let o = r === null ? this._itHead : r._next;
      return (
        (e._next = o),
        (e._prev = r),
        o === null ? (this._itTail = e) : (o._prev = e),
        r === null ? (this._itHead = e) : (r._next = e),
        this._linkedRecords === null && (this._linkedRecords = new lo()),
        this._linkedRecords.put(e),
        (e.currentIndex = n),
        e
      );
    }
    _remove(e) {
      return this._addToRemovals(this._unlink(e));
    }
    _unlink(e) {
      this._linkedRecords !== null && this._linkedRecords.remove(e);
      let r = e._prev,
        n = e._next;
      return (
        r === null ? (this._itHead = n) : (r._next = n),
        n === null ? (this._itTail = r) : (n._prev = r),
        e
      );
    }
    _addToMoves(e, r) {
      return (
        e.previousIndex === r ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = e)
            : (this._movesTail = this._movesTail._nextMoved = e)),
        e
      );
    }
    _addToRemovals(e) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new lo()),
        this._unlinkedRecords.put(e),
        (e.currentIndex = null),
        (e._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = e),
            (e._prevRemoved = null))
          : ((e._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = e)),
        e
      );
    }
    _addIdentityChange(e, r) {
      return (
        (e.item = r),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = e)
          : (this._identityChangesTail =
              this._identityChangesTail._nextIdentityChange =
                e),
        e
      );
    }
  },
  ps = class {
    constructor(e, r) {
      (this.item = e),
        (this.trackById = r),
        (this.currentIndex = null),
        (this.previousIndex = null),
        (this._nextPrevious = null),
        (this._prev = null),
        (this._next = null),
        (this._prevDup = null),
        (this._nextDup = null),
        (this._prevRemoved = null),
        (this._nextRemoved = null),
        (this._nextAdded = null),
        (this._nextMoved = null),
        (this._nextIdentityChange = null);
    }
  },
  gs = class {
    constructor() {
      (this._head = null), (this._tail = null);
    }
    add(e) {
      this._head === null
        ? ((this._head = this._tail = e),
          (e._nextDup = null),
          (e._prevDup = null))
        : ((this._tail._nextDup = e),
          (e._prevDup = this._tail),
          (e._nextDup = null),
          (this._tail = e));
    }
    get(e, r) {
      let n;
      for (n = this._head; n !== null; n = n._nextDup)
        if ((r === null || r <= n.currentIndex) && Object.is(n.trackById, e))
          return n;
      return null;
    }
    remove(e) {
      let r = e._prevDup,
        n = e._nextDup;
      return (
        r === null ? (this._head = n) : (r._nextDup = n),
        n === null ? (this._tail = r) : (n._prevDup = r),
        this._head === null
      );
    }
  },
  lo = class {
    constructor() {
      this.map = new Map();
    }
    put(e) {
      let r = e.trackById,
        n = this.map.get(r);
      n || ((n = new gs()), this.map.set(r, n)), n.add(e);
    }
    get(e, r) {
      let n = e,
        o = this.map.get(n);
      return o ? o.get(e, r) : null;
    }
    remove(e) {
      let r = e.trackById;
      return this.map.get(r).remove(e) && this.map.delete(r), e;
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function Au(t, e, r) {
  let n = t.previousIndex;
  if (n === null) return n;
  let o = 0;
  return r && n < r.length && (o = r[n]), n + e + o;
}
var ms = class {
    constructor() {}
    supports(e) {
      return e instanceof Map || sa(e);
    }
    create() {
      return new vs();
    }
  },
  vs = class {
    constructor() {
      (this._records = new Map()),
        (this._mapHead = null),
        (this._appendAfter = null),
        (this._previousMapHead = null),
        (this._changesHead = null),
        (this._changesTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null);
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._changesHead !== null ||
        this._removalsHead !== null
      );
    }
    forEachItem(e) {
      let r;
      for (r = this._mapHead; r !== null; r = r._next) e(r);
    }
    forEachPreviousItem(e) {
      let r;
      for (r = this._previousMapHead; r !== null; r = r._nextPrevious) e(r);
    }
    forEachChangedItem(e) {
      let r;
      for (r = this._changesHead; r !== null; r = r._nextChanged) e(r);
    }
    forEachAddedItem(e) {
      let r;
      for (r = this._additionsHead; r !== null; r = r._nextAdded) e(r);
    }
    forEachRemovedItem(e) {
      let r;
      for (r = this._removalsHead; r !== null; r = r._nextRemoved) e(r);
    }
    diff(e) {
      if (!e) e = new Map();
      else if (!(e instanceof Map || sa(e))) throw new m(900, !1);
      return this.check(e) ? this : null;
    }
    onDestroy() {}
    check(e) {
      this._reset();
      let r = this._mapHead;
      if (
        ((this._appendAfter = null),
        this._forEach(e, (n, o) => {
          if (r && r.key === o)
            this._maybeAddToChanges(r, n),
              (this._appendAfter = r),
              (r = r._next);
          else {
            let i = this._getOrCreateRecordForKey(o, n);
            r = this._insertBeforeOrAppend(r, i);
          }
        }),
        r)
      ) {
        r._prev && (r._prev._next = null), (this._removalsHead = r);
        for (let n = r; n !== null; n = n._nextRemoved)
          n === this._mapHead && (this._mapHead = null),
            this._records.delete(n.key),
            (n._nextRemoved = n._next),
            (n.previousValue = n.currentValue),
            (n.currentValue = null),
            (n._prev = null),
            (n._next = null);
      }
      return (
        this._changesTail && (this._changesTail._nextChanged = null),
        this._additionsTail && (this._additionsTail._nextAdded = null),
        this.isDirty
      );
    }
    _insertBeforeOrAppend(e, r) {
      if (e) {
        let n = e._prev;
        return (
          (r._next = e),
          (r._prev = n),
          (e._prev = r),
          n && (n._next = r),
          e === this._mapHead && (this._mapHead = r),
          (this._appendAfter = e),
          e
        );
      }
      return (
        this._appendAfter
          ? ((this._appendAfter._next = r), (r._prev = this._appendAfter))
          : (this._mapHead = r),
        (this._appendAfter = r),
        null
      );
    }
    _getOrCreateRecordForKey(e, r) {
      if (this._records.has(e)) {
        let o = this._records.get(e);
        this._maybeAddToChanges(o, r);
        let i = o._prev,
          s = o._next;
        return (
          i && (i._next = s),
          s && (s._prev = i),
          (o._next = null),
          (o._prev = null),
          o
        );
      }
      let n = new ys(e);
      return (
        this._records.set(e, n),
        (n.currentValue = r),
        this._addToAdditions(n),
        n
      );
    }
    _reset() {
      if (this.isDirty) {
        let e;
        for (
          this._previousMapHead = this._mapHead, e = this._previousMapHead;
          e !== null;
          e = e._next
        )
          e._nextPrevious = e._next;
        for (e = this._changesHead; e !== null; e = e._nextChanged)
          e.previousValue = e.currentValue;
        for (e = this._additionsHead; e != null; e = e._nextAdded)
          e.previousValue = e.currentValue;
        (this._changesHead = this._changesTail = null),
          (this._additionsHead = this._additionsTail = null),
          (this._removalsHead = null);
      }
    }
    _maybeAddToChanges(e, r) {
      Object.is(r, e.currentValue) ||
        ((e.previousValue = e.currentValue),
        (e.currentValue = r),
        this._addToChanges(e));
    }
    _addToAdditions(e) {
      this._additionsHead === null
        ? (this._additionsHead = this._additionsTail = e)
        : ((this._additionsTail._nextAdded = e), (this._additionsTail = e));
    }
    _addToChanges(e) {
      this._changesHead === null
        ? (this._changesHead = this._changesTail = e)
        : ((this._changesTail._nextChanged = e), (this._changesTail = e));
    }
    _forEach(e, r) {
      e instanceof Map
        ? e.forEach(r)
        : Object.keys(e).forEach((n) => r(e[n], n));
    }
  },
  ys = class {
    constructor(e) {
      (this.key = e),
        (this.previousValue = null),
        (this.currentValue = null),
        (this._nextPrevious = null),
        (this._next = null),
        (this._prev = null),
        (this._nextAdded = null),
        (this._nextRemoved = null),
        (this._nextChanged = null);
    }
  };
function _u() {
  return new _o([new fs()]);
}
var _o = (() => {
  let e = class e {
    constructor(n) {
      this.factories = n;
    }
    static create(n, o) {
      if (o != null) {
        let i = o.factories.slice();
        n = n.concat(i);
      }
      return new e(n);
    }
    static extend(n) {
      return {
        provide: e,
        useFactory: (o) => e.create(n, o || _u()),
        deps: [[e, new Io(), new Wn()]],
      };
    }
    find(n) {
      let o = this.factories.find((i) => i.supports(n));
      if (o != null) return o;
      throw new m(901, !1);
    }
  };
  e.ɵprov = y({ token: e, providedIn: "root", factory: _u });
  let t = e;
  return t;
})();
function Nu() {
  return new No([new ms()]);
}
var No = (() => {
  let e = class e {
    constructor(n) {
      this.factories = n;
    }
    static create(n, o) {
      if (o) {
        let i = o.factories.slice();
        n = n.concat(i);
      }
      return new e(n);
    }
    static extend(n) {
      return {
        provide: e,
        useFactory: (o) => e.create(n, o || Nu()),
        deps: [[e, new Io(), new Wn()]],
      };
    }
    find(n) {
      let o = this.factories.find((i) => i.supports(n));
      if (o) return o;
      throw new m(901, !1);
    }
  };
  e.ɵprov = y({ token: e, providedIn: "root", factory: Nu });
  let t = e;
  return t;
})();
function fo(t, e, r, n, o = !1) {
  for (; r !== null; ) {
    let i = e[r.index];
    i !== null && n.push(Ve(i)), Me(i) && Lm(i, n);
    let s = r.type;
    if (s & 8) fo(t, e, r.child, n);
    else if (s & 32) {
      let a = Xs(r, e),
        c;
      for (; (c = a()); ) n.push(c);
    } else if (s & 16) {
      let a = dd(e, r);
      if (Array.isArray(a)) n.push(...a);
      else {
        let c = ea(e[je]);
        fo(c[_], c, a, n, !0);
      }
    }
    r = o ? r.projectionNext : r.next;
  }
  return n;
}
function Lm(t, e) {
  for (let r = me; r < t.length; r++) {
    let n = t[r],
      o = n[_].firstChild;
    o !== null && fo(n[_], n, o, e);
  }
  t[St] !== t[Qe] && e.push(t[St]);
}
var yd = [];
function jm(t) {
  return t[Mt] ?? Vm(t);
}
function Vm(t) {
  let e = yd.pop() ?? Object.create(Bm);
  return (e.lView = t), e;
}
function Um(t) {
  t.lView[Mt] !== t && ((t.lView = null), yd.push(t));
}
var Bm = H(g({}, Ac), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: (t) => {
      kn(t.lView);
    },
    consumerOnSignalRead() {
      this.lView[Mt] = this;
    },
  }),
  Hm = "ngOriginalError";
function zi(t) {
  return t[Hm];
}
var Ue = class {
    constructor() {
      this._console = console;
    }
    handleError(e) {
      let r = this._findOriginalError(e);
      this._console.error("ERROR", e),
        r && this._console.error("ORIGINAL ERROR", r);
    }
    _findOriginalError(e) {
      let r = e && zi(e);
      for (; r && zi(r); ) r = zi(r);
      return r || null;
    }
  },
  Dd = new I("", {
    providedIn: "root",
    factory: () => p(Ue).handleError.bind(void 0),
  });
var Cd = !1,
  $m = new I("", { providedIn: "root", factory: () => Cd });
var Zn = {};
function Y(t) {
  wd(ht(), V(), Bs() + t, !1);
}
function wd(t, e, r, n) {
  if (!n)
    if ((e[D] & 3) === 3) {
      let i = t.preOrderCheckHooks;
      i !== null && Gr(e, i, r);
    } else {
      let i = t.preOrderHooks;
      i !== null && Wr(e, i, 0, r);
    }
  xt(r);
}
function U(t, e = M.Default) {
  let r = V();
  if (r === null) return v(t, e);
  let n = ye();
  return $l(n, r, ge(t), e);
}
function Ed() {
  let t = "invalid";
  throw new Error(t);
}
function zm(t, e) {
  let r = t.hostBindingOpCodes;
  if (r !== null)
    try {
      for (let n = 0; n < r.length; n++) {
        let o = r[n];
        if (o < 0) xt(~o);
        else {
          let i = o,
            s = r[++n],
            a = r[++n];
          rg(s, i);
          let c = e[i];
          a(2, c);
        }
      }
    } finally {
      xt(-1);
    }
}
function Oo(t, e, r, n, o, i, s, a, c, u, l) {
  let d = e.blueprint.slice();
  return (
    (d[Qe] = o),
    (d[D] = n | 4 | 128 | 8 | 64),
    (u !== null || (t && t[D] & 2048)) && (d[D] |= 2048),
    Cl(d),
    (d[G] = d[an] = t),
    (d[be] = r),
    (d[Ye] = s || (t && t[Ye])),
    (d[J] = a || (t && t[J])),
    (d[en] = c || (t && t[en]) || null),
    (d[Te] = i),
    (d[wo] = Qg()),
    (d[Kr] = l),
    (d[hl] = u),
    (d[je] = e.type == 2 ? t[je] : d),
    d
  );
}
function Ro(t, e, r, n, o) {
  let i = t.data[e];
  if (i === null) (i = Gm(t, e, r, n, o)), ng() && (i.flags |= 32);
  else if (i.type & 64) {
    (i.type = r), (i.value = n), (i.attrs = o);
    let s = Xp();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return Gn(i, !0), i;
}
function Gm(t, e, r, n, o) {
  let i = bl(),
    s = Ml(),
    a = s ? i : i && i.parent,
    c = (t.data[e] = Qm(t, a, r, e, n, o));
  return (
    t.firstChild === null && (t.firstChild = c),
    i !== null &&
      (s
        ? i.child == null && c.parent !== null && (i.child = c)
        : i.next === null && ((i.next = c), (c.prev = i))),
    c
  );
}
function Id(t, e, r, n) {
  if (r === 0) return -1;
  let o = e.length;
  for (let i = 0; i < r; i++) e.push(n), t.blueprint.push(n), t.data.push(null);
  return o;
}
function bd(t, e, r, n, o) {
  let i = Bs(),
    s = n & 2;
  try {
    xt(-1), s && e.length > ut && wd(t, e, ut, !1), Fe(s ? 2 : 0, o), r(n, o);
  } finally {
    xt(i), Fe(s ? 3 : 1, o);
  }
}
function Md(t, e, r) {
  if (gl(e)) {
    let n = ae(null);
    try {
      let o = e.directiveStart,
        i = e.directiveEnd;
      for (let s = o; s < i; s++) {
        let a = t.data[s];
        a.contentQueries && a.contentQueries(1, r[s], s);
      }
    } finally {
      ae(n);
    }
  }
}
function Sd(t, e, r) {
  Il() && (rv(t, e, r, ve(r, e)), (r.flags & 64) === 64 && Nd(t, e, r));
}
function xd(t, e, r = ve) {
  let n = e.localNames;
  if (n !== null) {
    let o = e.index + 1;
    for (let i = 0; i < n.length; i += 2) {
      let s = n[i + 1],
        a = s === -1 ? r(e, t) : t[s];
      t[o++] = a;
    }
  }
}
function Td(t) {
  let e = t.tView;
  return e === null || e.incompleteFirstPass
    ? (t.tView = aa(
        1,
        null,
        t.template,
        t.decls,
        t.vars,
        t.directiveDefs,
        t.pipeDefs,
        t.viewQuery,
        t.schemas,
        t.consts,
        t.id
      ))
    : e;
}
function aa(t, e, r, n, o, i, s, a, c, u, l) {
  let d = ut + n,
    f = d + o,
    h = Wm(d, f),
    w = typeof u == "function" ? u() : u;
  return (h[_] = {
    type: t,
    blueprint: h,
    template: r,
    queries: null,
    viewQuery: a,
    declTNode: e,
    data: h.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: f,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == "function" ? i() : i,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: c,
    consts: w,
    incompleteFirstPass: !1,
    ssrId: l,
  });
}
function Wm(t, e) {
  let r = [];
  for (let n = 0; n < e; n++) r.push(n < t ? null : Zn);
  return r;
}
function qm(t, e, r, n) {
  let i = n.get($m, Cd) || r === Le.ShadowDom,
    s = t.selectRootElement(e, i);
  return Zm(s), s;
}
function Zm(t) {
  Ym(t);
}
var Ym = (t) => null;
function Qm(t, e, r, n, o, i) {
  let s = e ? e.injectorIndex : -1,
    a = 0;
  return (
    Qp() && (a |= 128),
    {
      type: r,
      index: n,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: e,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function Ou(t, e, r, n) {
  for (let o in t)
    if (t.hasOwnProperty(o)) {
      r = r === null ? {} : r;
      let i = t[o];
      n === null ? Ru(r, e, o, i) : n.hasOwnProperty(o) && Ru(r, e, n[o], i);
    }
  return r;
}
function Ru(t, e, r, n) {
  t.hasOwnProperty(r) ? t[r].push(e, n) : (t[r] = [e, n]);
}
function Jm(t, e, r) {
  let n = e.directiveStart,
    o = e.directiveEnd,
    i = t.data,
    s = e.attrs,
    a = [],
    c = null,
    u = null;
  for (let l = n; l < o; l++) {
    let d = i[l],
      f = r ? r.get(d) : null,
      h = f ? f.inputs : null,
      w = f ? f.outputs : null;
    (c = Ou(d.inputs, l, c, h)), (u = Ou(d.outputs, l, u, w));
    let O = c !== null && s !== null && !sl(e) ? pv(c, l, s) : null;
    a.push(O);
  }
  c !== null &&
    (c.hasOwnProperty("class") && (e.flags |= 8),
    c.hasOwnProperty("style") && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = c),
    (e.outputs = u);
}
function Km(t) {
  return t === "class"
    ? "className"
    : t === "for"
    ? "htmlFor"
    : t === "formaction"
    ? "formAction"
    : t === "innerHtml"
    ? "innerHTML"
    : t === "readonly"
    ? "readOnly"
    : t === "tabindex"
    ? "tabIndex"
    : t;
}
function Xm(t, e, r, n, o, i, s, a) {
  let c = ve(e, r),
    u = e.inputs,
    l;
  !a && u != null && (l = u[n])
    ? (ca(t, r, l, n, o), Eo(e) && ev(r, e.index))
    : e.type & 3
    ? ((n = Km(n)),
      (o = s != null ? s(o, e.value || "", n) : o),
      i.setProperty(c, n, o))
    : e.type & 12;
}
function ev(t, e) {
  let r = ft(e, t);
  r[D] & 16 || (r[D] |= 64);
}
function Ad(t, e, r, n) {
  if (Il()) {
    let o = n === null ? null : { "": -1 },
      i = iv(t, r),
      s,
      a;
    i === null ? (s = a = null) : ([s, a] = i),
      s !== null && _d(t, e, r, s, o, a),
      o && sv(r, n, o);
  }
  r.mergedAttrs = Fs(r.mergedAttrs, r.attrs);
}
function _d(t, e, r, n, o, i) {
  for (let u = 0; u < n.length; u++) vg(Vl(r, e), t, n[u].type);
  cv(r, t.data.length, n.length);
  for (let u = 0; u < n.length; u++) {
    let l = n[u];
    l.providersResolver && l.providersResolver(l);
  }
  let s = !1,
    a = !1,
    c = Id(t, e, n.length, null);
  for (let u = 0; u < n.length; u++) {
    let l = n[u];
    (r.mergedAttrs = Fs(r.mergedAttrs, l.hostAttrs)),
      uv(t, r, e, c, l),
      av(c, l, o),
      l.contentQueries !== null && (r.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (r.flags |= 64);
    let d = l.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(r.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(r.index), (a = !0)),
      c++;
  }
  Jm(t, r, i);
}
function tv(t, e, r, n, o) {
  let i = o.hostBindings;
  if (i) {
    let s = t.hostBindingOpCodes;
    s === null && (s = t.hostBindingOpCodes = []);
    let a = ~e.index;
    nv(s) != a && s.push(a), s.push(r, n, i);
  }
}
function nv(t) {
  let e = t.length;
  for (; e > 0; ) {
    let r = t[--e];
    if (typeof r == "number" && r < 0) return r;
  }
  return 0;
}
function rv(t, e, r, n) {
  let o = r.directiveStart,
    i = r.directiveEnd;
  Eo(r) && lv(e, r, t.data[o + r.componentOffset]),
    t.firstCreatePass || Vl(r, e),
    Tt(n, e);
  let s = r.initialInputs;
  for (let a = o; a < i; a++) {
    let c = t.data[a],
      u = jn(e, t, a, r);
    if ((Tt(u, e), s !== null && hv(e, a - o, u, c, r, s), $n(c))) {
      let l = ft(r.index, e);
      l[be] = jn(e, t, a, r);
    }
  }
}
function Nd(t, e, r) {
  let n = r.directiveStart,
    o = r.directiveEnd,
    i = r.index,
    s = og();
  try {
    xt(i);
    for (let a = n; a < o; a++) {
      let c = t.data[a],
        u = e[a];
      Xi(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          ov(c, u);
    }
  } finally {
    xt(-1), Xi(s);
  }
}
function ov(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e);
}
function iv(t, e) {
  let r = t.directiveRegistry,
    n = null,
    o = null;
  if (r)
    for (let i = 0; i < r.length; i++) {
      let s = r[i];
      if (Mp(e, s.selectors, !1))
        if ((n || (n = []), $n(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (o = o || new Map()),
              s.findHostDirectiveDefs(s, a, o),
              n.unshift(...a, s);
            let c = a.length;
            Ds(t, e, c);
          } else n.unshift(s), Ds(t, e, 0);
        else
          (o = o || new Map()), s.findHostDirectiveDefs?.(s, n, o), n.push(s);
    }
  return n === null ? null : [n, o];
}
function Ds(t, e, r) {
  (e.componentOffset = r), (t.components ??= []).push(e.index);
}
function sv(t, e, r) {
  if (e) {
    let n = (t.localNames = []);
    for (let o = 0; o < e.length; o += 2) {
      let i = r[e[o + 1]];
      if (i == null) throw new m(-301, !1);
      n.push(e[o], i);
    }
  }
}
function av(t, e, r) {
  if (r) {
    if (e.exportAs)
      for (let n = 0; n < e.exportAs.length; n++) r[e.exportAs[n]] = t;
    $n(e) && (r[""] = t);
  }
}
function cv(t, e, r) {
  (t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + r),
    (t.providerIndexes = e);
}
function uv(t, e, r, n, o) {
  t.data[n] = o;
  let i = o.factory || (o.factory = nn(o.type, !0)),
    s = new Ln(i, $n(o), U);
  (t.blueprint[n] = s), (r[n] = s), tv(t, e, n, Id(t, r, o.hostVars, Zn), o);
}
function lv(t, e, r) {
  let n = ve(e, t),
    o = Td(r),
    i = t[Ye].rendererFactory,
    s = 16;
  r.signals ? (s = 4096) : r.onPush && (s = 64);
  let a = Po(
    t,
    Oo(t, o, null, s, n, e, null, i.createRenderer(n, r), null, null, null)
  );
  t[e.index] = a;
}
function dv(t, e, r, n, o, i) {
  let s = ve(t, e);
  fv(e[J], s, i, t.value, r, n, o);
}
function fv(t, e, r, n, o, i, s) {
  if (i == null) t.removeAttribute(e, o, r);
  else {
    let a = s == null ? vo(i) : s(i, n || "", o);
    t.setAttribute(e, o, a, r);
  }
}
function hv(t, e, r, n, o, i) {
  let s = i[e];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let c = s[a++],
        u = s[a++],
        l = s[a++];
      Od(n, r, c, u, l);
    }
}
function Od(t, e, r, n, o) {
  let i = ae(null);
  try {
    let s = t.inputTransforms;
    s !== null && s.hasOwnProperty(n) && (o = s[n].call(e, o)),
      t.setInput !== null ? t.setInput(e, o, r, n) : (e[n] = o);
  } finally {
    ae(i);
  }
}
function pv(t, e, r) {
  let n = null,
    o = 0;
  for (; o < r.length; ) {
    let i = r[o];
    if (i === 0) {
      o += 4;
      continue;
    } else if (i === 5) {
      o += 2;
      continue;
    }
    if (typeof i == "number") break;
    if (t.hasOwnProperty(i)) {
      n === null && (n = []);
      let s = t[i];
      for (let a = 0; a < s.length; a += 2)
        if (s[a] === e) {
          n.push(i, s[a + 1], r[o + 1]);
          break;
        }
    }
    o += 2;
  }
  return n;
}
function Rd(t, e, r, n) {
  return [t, !0, 0, e, null, n, null, r, null, null];
}
function Pd(t, e) {
  let r = t.contentQueries;
  if (r !== null) {
    let n = ae(null);
    try {
      for (let o = 0; o < r.length; o += 2) {
        let i = r[o],
          s = r[o + 1];
        if (s !== -1) {
          let a = t.data[s];
          xl(i), a.contentQueries(2, e[s], s);
        }
      }
    } finally {
      ae(n);
    }
  }
}
function Po(t, e) {
  return t[Pn] ? (t[yu][Ie] = e) : (t[Pn] = e), (t[yu] = e), e;
}
function Cs(t, e, r) {
  xl(0);
  let n = ae(null);
  try {
    e(t, r);
  } finally {
    ae(n);
  }
}
function gv(t) {
  return t[Rn] || (t[Rn] = []);
}
function mv(t) {
  return t.cleanup || (t.cleanup = []);
}
function Fd(t, e) {
  let r = t[en],
    n = r ? r.get(Ue, null) : null;
  n && n.handleError(e);
}
function ca(t, e, r, n, o) {
  for (let i = 0; i < r.length; ) {
    let s = r[i++],
      a = r[i++],
      c = e[s],
      u = t.data[s];
    Od(u, c, n, a, o);
  }
}
function vv(t, e, r) {
  let n = Hp(e, t);
  tm(t[J], n, r);
}
var yv = 100;
function Dv(t, e = !0) {
  let r = t[Ye],
    n = r.rendererFactory,
    o = r.afterRenderEventManager,
    i = !1;
  i || (n.begin?.(), o?.begin());
  try {
    Cv(t);
  } catch (s) {
    throw (e && Fd(t, s), s);
  } finally {
    i || (n.end?.(), r.inlineEffectRunner?.flush(), o?.end());
  }
}
function Cv(t) {
  ws(t, 0);
  let e = 0;
  for (; wl(t); ) {
    if (e === yv) throw new m(103, !1);
    e++, ws(t, 1);
  }
}
function wv(t, e, r, n) {
  let o = e[D];
  if ((o & 256) === 256) return;
  let i = !1;
  !i && e[Ye].inlineEffectRunner?.flush(), Vs(e);
  let s = null,
    a = null;
  !i && Ev(t) && ((a = jm(e)), (s = _c(a)));
  try {
    Cl(e), tg(t.bindingStartIndex), r !== null && bd(t, e, r, 2, n);
    let c = (o & 3) === 3;
    if (!i)
      if (c) {
        let d = t.preOrderCheckHooks;
        d !== null && Gr(e, d, null);
      } else {
        let d = t.preOrderHooks;
        d !== null && Wr(e, d, 0, null), Vi(e, 0);
      }
    if ((Iv(e), kd(e, 0), t.contentQueries !== null && Pd(t, e), !i))
      if (c) {
        let d = t.contentCheckHooks;
        d !== null && Gr(e, d);
      } else {
        let d = t.contentHooks;
        d !== null && Wr(e, d, 1), Vi(e, 1);
      }
    zm(t, e);
    let u = t.components;
    u !== null && jd(e, u, 0);
    let l = t.viewQuery;
    if ((l !== null && Cs(2, l, n), !i))
      if (c) {
        let d = t.viewCheckHooks;
        d !== null && Gr(e, d);
      } else {
        let d = t.viewHooks;
        d !== null && Wr(e, d, 2), Vi(e, 2);
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[ji])) {
      for (let d of e[ji]) d();
      e[ji] = null;
    }
    i || (e[D] &= -73);
  } catch (c) {
    throw (kn(e), c);
  } finally {
    a !== null && (Nc(a, s), Um(a)), Us();
  }
}
function Ev(t) {
  return t.type !== 2;
}
function kd(t, e) {
  for (let r = od(t); r !== null; r = id(r)) {
    r[D] &= ~tn.HasChildViewsToRefresh;
    for (let n = me; n < r.length; n++) {
      let o = r[n];
      Ld(o, e);
    }
  }
}
function Iv(t) {
  for (let e = od(t); e !== null; e = id(e)) {
    if (!(e[D] & tn.HasTransplantedViews)) continue;
    let r = e[eo];
    for (let n = 0; n < r.length; n++) {
      let o = r[n],
        i = o[G];
      zp(o);
    }
  }
}
function bv(t, e, r) {
  let n = ft(e, t);
  Ld(n, r);
}
function Ld(t, e) {
  Ls(t) && ws(t, e);
}
function ws(t, e) {
  let n = t[_],
    o = t[D],
    i = t[Mt],
    s = !!(e === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && e === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && Ci(i))),
    i && (i.dirty = !1),
    (t[D] &= -9217),
    s)
  )
    wv(n, t, n.template, t[be]);
  else if (o & 8192) {
    kd(t, 1);
    let a = n.components;
    a !== null && jd(t, a, 1);
  }
}
function jd(t, e, r) {
  for (let n = 0; n < e.length; n++) bv(t, e[n], r);
}
function ua(t) {
  for (t[Ye].changeDetectionScheduler?.notify(); t; ) {
    t[D] |= 64;
    let e = ea(t);
    if (Pp(t) && !e) return t;
    t = e;
  }
  return null;
}
var At = class {
    get rootNodes() {
      let e = this._lView,
        r = e[_];
      return fo(r, e, r.firstChild, []);
    }
    constructor(e, r, n = !0) {
      (this._lView = e),
        (this._cdRefInjectingView = r),
        (this.notifyErrorHandler = n),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[be];
    }
    set context(e) {
      this._lView[be] = e;
    }
    get destroyed() {
      return (this._lView[D] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let e = this._lView[G];
        if (Me(e)) {
          let r = e[Xr],
            n = r ? r.indexOf(this) : -1;
          n > -1 && (as(e, n), oo(r, n));
        }
        this._attachedToViewContainer = !1;
      }
      ud(this._lView[_], this._lView);
    }
    onDestroy(e) {
      El(this._lView, e);
    }
    markForCheck() {
      ua(this._cdRefInjectingView || this._lView);
    }
    detach() {
      this._lView[D] &= -129;
    }
    reattach() {
      Ki(this._lView), (this._lView[D] |= 128);
    }
    detectChanges() {
      (this._lView[D] |= 1024), Dv(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new m(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      (this._appRef = null), om(this._lView[_], this._lView);
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new m(902, !1);
      (this._appRef = e), Ki(this._lView);
    }
  },
  Fo = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = Mv;
    let t = e;
    return t;
  })();
function Mv(t) {
  return Sv(ye(), V(), (t & 16) === 16);
}
function Sv(t, e, r) {
  if (Eo(t) && !r) {
    let n = ft(t.index, e);
    return new At(n, n);
  } else if (t.type & 47) {
    let n = e[je];
    return new At(n, e);
  }
  return null;
}
var Vd = (() => {
    let e = class e {};
    (e.__NG_ELEMENT_ID__ = xv), (e.__NG_ENV_ID__ = (n) => n);
    let t = e;
    return t;
  })(),
  Es = class extends Vd {
    constructor(e) {
      super(), (this._lView = e);
    }
    onDestroy(e) {
      return El(this._lView, e), () => Wp(this._lView, e);
    }
  };
function xv() {
  return new Es(V());
}
var Pu = new Set();
function la(t) {
  Pu.has(t) ||
    (Pu.add(t),
    performance?.mark?.("mark_feature_usage", { detail: { feature: t } }));
}
var Is = class extends re {
  constructor(e = !1) {
    super(), (this.__isAsync = e);
  }
  emit(e) {
    super.next(e);
  }
  subscribe(e, r, n) {
    let o = e,
      i = r || (() => null),
      s = n;
    if (e && typeof e == "object") {
      let c = e;
      (o = c.next?.bind(c)), (i = c.error?.bind(c)), (s = c.complete?.bind(c));
    }
    this.__isAsync && ((i = Gi(i)), o && (o = Gi(o)), s && (s = Gi(s)));
    let a = super.subscribe({ next: o, error: i, complete: s });
    return e instanceof z && e.add(a), a;
  }
};
function Gi(t) {
  return (e) => {
    setTimeout(t, void 0, e);
  };
}
var X = Is;
function Fu(...t) {}
function Tv() {
  let t = typeof te.requestAnimationFrame == "function",
    e = te[t ? "requestAnimationFrame" : "setTimeout"],
    r = te[t ? "cancelAnimationFrame" : "clearTimeout"];
  if (typeof Zone < "u" && e && r) {
    let n = e[Zone.__symbol__("OriginalDelegate")];
    n && (e = n);
    let o = r[Zone.__symbol__("OriginalDelegate")];
    o && (r = o);
  }
  return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: r };
}
var L = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: r = !1,
      shouldCoalesceRunChangeDetection: n = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new X(!1)),
        (this.onMicrotaskEmpty = new X(!1)),
        (this.onStable = new X(!1)),
        (this.onError = new X(!1)),
        typeof Zone > "u")
      )
        throw new m(908, !1);
      Zone.assertZonePatched();
      let o = this;
      (o._nesting = 0),
        (o._outer = o._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e &&
          Zone.longStackTraceZoneSpec &&
          (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
        (o.shouldCoalesceEventChangeDetection = !n && r),
        (o.shouldCoalesceRunChangeDetection = n),
        (o.lastRequestAnimationFrameId = -1),
        (o.nativeRequestAnimationFrame = Tv().nativeRequestAnimationFrame),
        Nv(o);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0;
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new m(909, !1);
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new m(909, !1);
    }
    run(e, r, n) {
      return this._inner.run(e, r, n);
    }
    runTask(e, r, n, o) {
      let i = this._inner,
        s = i.scheduleEventTask("NgZoneEvent: " + o, e, Av, Fu, Fu);
      try {
        return i.runTask(s, r, n);
      } finally {
        i.cancelTask(s);
      }
    }
    runGuarded(e, r, n) {
      return this._inner.runGuarded(e, r, n);
    }
    runOutsideAngular(e) {
      return this._outer.run(e);
    }
  },
  Av = {};
function da(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      t._nesting++, t.onMicrotaskEmpty.emit(null);
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null));
        } finally {
          t.isStable = !0;
        }
    }
}
function _v(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      te,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            "fakeTopEventTask",
            () => {
              (t.lastRequestAnimationFrameId = -1),
                bs(t),
                (t.isCheckStableRunning = !0),
                da(t),
                (t.isCheckStableRunning = !1);
            },
            void 0,
            () => {},
            () => {}
          )),
          t.fakeTopEventTask.invoke();
      }
    )),
    bs(t));
}
function Nv(t) {
  let e = () => {
    _v(t);
  };
  t._inner = t._inner.fork({
    name: "angular",
    properties: { isAngularZone: !0 },
    onInvokeTask: (r, n, o, i, s, a) => {
      if (Ov(a)) return r.invokeTask(o, i, s, a);
      try {
        return ku(t), r.invokeTask(o, i, s, a);
      } finally {
        ((t.shouldCoalesceEventChangeDetection && i.type === "eventTask") ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          Lu(t);
      }
    },
    onInvoke: (r, n, o, i, s, a, c) => {
      try {
        return ku(t), r.invoke(o, i, s, a, c);
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), Lu(t);
      }
    },
    onHasTask: (r, n, o, i) => {
      r.hasTask(o, i),
        n === o &&
          (i.change == "microTask"
            ? ((t._hasPendingMicrotasks = i.microTask), bs(t), da(t))
            : i.change == "macroTask" &&
              (t.hasPendingMacrotasks = i.macroTask));
    },
    onHandleError: (r, n, o, i) => (
      r.handleError(o, i), t.runOutsideAngular(() => t.onError.emit(i)), !1
    ),
  });
}
function bs(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function ku(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function Lu(t) {
  t._nesting--, da(t);
}
var Ms = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new X()),
      (this.onMicrotaskEmpty = new X()),
      (this.onStable = new X()),
      (this.onError = new X());
  }
  run(e, r, n) {
    return e.apply(r, n);
  }
  runGuarded(e, r, n) {
    return e.apply(r, n);
  }
  runOutsideAngular(e) {
    return e();
  }
  runTask(e, r, n, o) {
    return e.apply(r, n);
  }
};
function Ov(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0;
}
function Rv(t = "zone.js", e) {
  return t === "noop" ? new Ms() : t === "zone.js" ? new L(e) : t;
}
var Jt = (function (t) {
    return (
      (t[(t.EarlyRead = 0)] = "EarlyRead"),
      (t[(t.Write = 1)] = "Write"),
      (t[(t.MixedReadWrite = 2)] = "MixedReadWrite"),
      (t[(t.Read = 3)] = "Read"),
      t
    );
  })(Jt || {}),
  Pv = { destroy() {} };
function fa(t, e) {
  !e && Gg(fa);
  let r = e?.injector ?? p(Ae);
  if (!Zg(r)) return Pv;
  la("NgAfterNextRender");
  let n = r.get(Ud),
    o = (n.handler ??= new xs()),
    i = e?.phase ?? Jt.MixedReadWrite,
    s = () => {
      o.unregister(c), a();
    },
    a = r.get(Vd).onDestroy(s),
    c = new Ss(r, i, () => {
      s(), t();
    });
  return o.register(c), { destroy: s };
}
var Ss = class {
    constructor(e, r, n) {
      (this.phase = r),
        (this.callbackFn = n),
        (this.zone = e.get(L)),
        (this.errorHandler = e.get(Ue, null, { optional: !0 }));
    }
    invoke() {
      try {
        this.zone.runOutsideAngular(this.callbackFn);
      } catch (e) {
        this.errorHandler?.handleError(e);
      }
    }
  },
  xs = class {
    constructor() {
      (this.executingCallbacks = !1),
        (this.buckets = {
          [Jt.EarlyRead]: new Set(),
          [Jt.Write]: new Set(),
          [Jt.MixedReadWrite]: new Set(),
          [Jt.Read]: new Set(),
        }),
        (this.deferredCallbacks = new Set());
    }
    validateBegin() {
      if (this.executingCallbacks) throw new m(102, !1);
    }
    register(e) {
      (this.executingCallbacks
        ? this.deferredCallbacks
        : this.buckets[e.phase]
      ).add(e);
    }
    unregister(e) {
      this.buckets[e.phase].delete(e), this.deferredCallbacks.delete(e);
    }
    execute() {
      this.executingCallbacks = !0;
      for (let e of Object.values(this.buckets)) for (let r of e) r.invoke();
      this.executingCallbacks = !1;
      for (let e of this.deferredCallbacks) this.buckets[e.phase].add(e);
      this.deferredCallbacks.clear();
    }
    destroy() {
      for (let e of Object.values(this.buckets)) e.clear();
      this.deferredCallbacks.clear();
    }
  },
  Ud = (() => {
    let e = class e {
      constructor() {
        (this.renderDepth = 0),
          (this.handler = null),
          (this.internalCallbacks = []);
      }
      begin() {
        this.handler?.validateBegin(), this.renderDepth++;
      }
      end() {
        if ((this.renderDepth--, this.renderDepth === 0)) {
          for (let n of this.internalCallbacks) n();
          (this.internalCallbacks.length = 0), this.handler?.execute();
        }
      }
      ngOnDestroy() {
        this.handler?.destroy(),
          (this.handler = null),
          (this.internalCallbacks.length = 0);
      }
    };
    e.ɵprov = y({ token: e, providedIn: "root", factory: () => new e() });
    let t = e;
    return t;
  })();
function Fv(t, e) {
  let r = ft(e, t),
    n = r[_];
  kv(n, r);
  let o = r[Qe];
  o !== null && r[Kr] === null && (r[Kr] = ia(o, r[en])), ha(n, r, r[be]);
}
function kv(t, e) {
  for (let r = e.length; r < t.blueprint.length; r++) e.push(t.blueprint[r]);
}
function ha(t, e, r) {
  Vs(e);
  try {
    let n = t.viewQuery;
    n !== null && Cs(1, n, r);
    let o = t.template;
    o !== null && bd(t, e, o, 1, r),
      t.firstCreatePass && (t.firstCreatePass = !1),
      t.staticContentQueries && Pd(t, e),
      t.staticViewQueries && Cs(2, t.viewQuery, r);
    let i = t.components;
    i !== null && Lv(e, i);
  } catch (n) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      n)
    );
  } finally {
    (e[D] &= -5), Us();
  }
}
function Lv(t, e) {
  for (let r = 0; r < e.length; r++) Fv(t, e[r]);
}
function Ts(t, e, r) {
  let n = r ? t.styles : null,
    o = r ? t.classes : null,
    i = 0;
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let a = e[s];
      if (typeof a == "number") i = a;
      else if (i == 1) o = cu(o, a);
      else if (i == 2) {
        let c = a,
          u = e[++s];
        n = cu(n, c + ": " + u + ";");
      }
    }
  r ? (t.styles = n) : (t.stylesWithoutHost = n),
    r ? (t.classes = o) : (t.classesWithoutHost = o);
}
var ho = class extends To {
  constructor(e) {
    super(), (this.ngModule = e);
  }
  resolveComponentFactory(e) {
    let r = ct(e);
    return new on(r, this.ngModule);
  }
};
function ju(t) {
  let e = [];
  for (let r in t)
    if (t.hasOwnProperty(r)) {
      let n = t[r];
      e.push({ propName: n, templateName: r });
    }
  return e;
}
function jv(t) {
  let e = t.toLowerCase();
  return e === "svg" ? jp : e === "math" ? Vp : null;
}
var As = class {
    constructor(e, r) {
      (this.injector = e), (this.parentInjector = r);
    }
    get(e, r, n) {
      n = Do(n);
      let o = this.injector.get(e, $i, n);
      return o !== $i || r === $i ? o : this.parentInjector.get(e, r, n);
    }
  },
  on = class extends uo {
    get inputs() {
      let e = this.componentDef,
        r = e.inputTransforms,
        n = ju(e.inputs);
      if (r !== null)
        for (let o of n)
          r.hasOwnProperty(o.propName) && (o.transform = r[o.propName]);
      return n;
    }
    get outputs() {
      return ju(this.componentDef.outputs);
    }
    constructor(e, r) {
      super(),
        (this.componentDef = e),
        (this.ngModule = r),
        (this.componentType = e.type),
        (this.selector = Ap(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!r);
    }
    create(e, r, n, o) {
      o = o || this.ngModule;
      let i = o instanceof ue ? o : o?.injector;
      i &&
        this.componentDef.getStandaloneInjector !== null &&
        (i = this.componentDef.getStandaloneInjector(i) || i);
      let s = i ? new As(e, i) : e,
        a = s.get(Un, null);
      if (a === null) throw new m(407, !1);
      let c = s.get(Pm, null),
        u = s.get(Ud, null),
        l = s.get(us, null),
        d = {
          rendererFactory: a,
          sanitizer: c,
          inlineEffectRunner: null,
          afterRenderEventManager: u,
          changeDetectionScheduler: l,
        },
        f = a.createRenderer(null, this.componentDef),
        h = this.componentDef.selectors[0][0] || "div",
        w = n ? qm(f, n, this.componentDef.encapsulation, s) : ad(f, h, jv(h)),
        O = 512;
      this.componentDef.signals
        ? (O |= 4096)
        : this.componentDef.onPush || (O |= 16);
      let K = null;
      w !== null && (K = ia(w, s, !0));
      let j = aa(0, null, null, 1, 0, null, null, null, null, null, null),
        se = Oo(null, j, null, O, null, null, d, f, s, null, K);
      Vs(se);
      let Ge, Ce;
      try {
        let Oe = this.componentDef,
          We,
          yi = null;
        Oe.findHostDirectiveDefs
          ? ((We = []),
            (yi = new Map()),
            Oe.findHostDirectiveDefs(Oe, We, yi),
            We.push(Oe))
          : (We = [Oe]);
        let Eh = Vv(se, w),
          Ih = Uv(Eh, w, Oe, We, se, d, f);
        (Ce = Dl(j, ut)),
          w && $v(f, Oe, w, n),
          r !== void 0 && zv(Ce, this.ngContentSelectors, r),
          (Ge = Hv(Ih, Oe, We, yi, se, [Gv])),
          ha(j, se, null);
      } finally {
        Us();
      }
      return new _s(this.componentType, Ge, Ao(Ce, se), se, Ce);
    }
  },
  _s = class extends ls {
    constructor(e, r, n, o, i) {
      super(),
        (this.location = n),
        (this._rootLView = o),
        (this._tNode = i),
        (this.previousInputValues = null),
        (this.instance = r),
        (this.hostView = this.changeDetectorRef = new At(o, void 0, !1)),
        (this.componentType = e);
    }
    setInput(e, r) {
      let n = this._tNode.inputs,
        o;
      if (n !== null && (o = n[e])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(e) &&
            Object.is(this.previousInputValues.get(e), r))
        )
          return;
        let i = this._rootLView;
        ca(i[_], i, o, e, r), this.previousInputValues.set(e, r);
        let s = ft(this._tNode.index, i);
        ua(s);
      }
    }
    get injector() {
      return new bt(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(e) {
      this.hostView.onDestroy(e);
    }
  };
function Vv(t, e) {
  let r = t[_],
    n = ut;
  return (t[n] = e), Ro(r, n, 2, "#host", null);
}
function Uv(t, e, r, n, o, i, s) {
  let a = o[_];
  Bv(n, t, e, s);
  let c = null;
  e !== null && (c = ia(e, o[en]));
  let u = i.rendererFactory.createRenderer(e, r),
    l = 16;
  r.signals ? (l = 4096) : r.onPush && (l = 64);
  let d = Oo(o, Td(r), null, l, o[t.index], t, i, u, null, null, c);
  return (
    a.firstCreatePass && Ds(a, t, n.length - 1), Po(o, d), (o[t.index] = d)
  );
}
function Bv(t, e, r, n) {
  for (let o of t) e.mergedAttrs = Fs(e.mergedAttrs, o.hostAttrs);
  e.mergedAttrs !== null &&
    (Ts(e, e.mergedAttrs, !0), r !== null && hd(n, r, e));
}
function Hv(t, e, r, n, o, i) {
  let s = ye(),
    a = o[_],
    c = ve(s, o);
  _d(a, o, s, r, null, n);
  for (let l = 0; l < r.length; l++) {
    let d = s.directiveStart + l,
      f = jn(o, a, d, s);
    Tt(f, o);
  }
  Nd(a, o, s), c && Tt(c, o);
  let u = jn(o, a, s.directiveStart + s.componentOffset, s);
  if (((t[be] = o[be] = u), i !== null)) for (let l of i) l(u, e);
  return Md(a, s, t), u;
}
function $v(t, e, r, n) {
  if (n) Qi(t, r, ["ng-version", "17.0.8"]);
  else {
    let { attrs: o, classes: i } = _p(e.selectors[0]);
    o && Qi(t, r, o), i && i.length > 0 && fd(t, r, i.join(" "));
  }
}
function zv(t, e, r) {
  let n = (t.projection = []);
  for (let o = 0; o < e.length; o++) {
    let i = r[o];
    n.push(i != null ? Array.from(i) : null);
  }
}
function Gv() {
  let t = ye();
  zs(V()[_], t);
}
function pa(t) {
  let e = t.inputConfig,
    r = {};
  for (let n in e)
    if (e.hasOwnProperty(n)) {
      let o = e[n];
      Array.isArray(o) && o[2] && (r[n] = o[2]);
    }
  t.inputTransforms = r;
}
function Bd(t, e, r) {
  return (t[e] = r);
}
function sn(t, e, r) {
  let n = t[e];
  return Object.is(n, r) ? !1 : ((t[e] = r), !0);
}
function Wv(t, e, r, n) {
  let o = sn(t, e, r);
  return sn(t, e + 1, n) || o;
}
function ga(t, e, r, n) {
  let o = V(),
    i = js();
  if (sn(o, i, e)) {
    let s = ht(),
      a = Rl();
    dv(a, o, t, e, r, n);
  }
  return ga;
}
function qv(t, e, r, n) {
  return sn(t, js(), r) ? e + vo(r) + n : Zn;
}
function _e(t, e, r) {
  let n = V(),
    o = js();
  if (sn(n, o, e)) {
    let i = ht(),
      s = Rl();
    Xm(i, s, n, t, e, n[J], r, !1);
  }
  return _e;
}
function Vu(t, e, r, n, o) {
  let i = e.inputs,
    s = o ? "class" : "style";
  ca(t, r, i[s], s, n);
}
var aS = new RegExp(`^(\\d+)*(${Tm}|${xm})*(.*)`);
var Zv = (t, e) => null;
function Uu(t, e) {
  return Zv(t, e);
}
function Yv(t, e, r, n) {
  let o = e.tView,
    s = t[D] & 4096 ? 4096 : 16,
    a = Oo(
      t,
      o,
      r,
      s,
      null,
      e,
      null,
      null,
      null,
      n?.injector ?? null,
      n?.dehydratedView ?? null
    ),
    c = t[e.index];
  a[Co] = c;
  let u = t[Fn];
  return u !== null && (a[Fn] = u.createEmbeddedView(o)), ha(o, a, r), a;
}
function Bu(t, e) {
  return !e || e.firstChild === null || nd(t);
}
function Qv(t, e, r, n = !0) {
  let o = e[_];
  if ((sm(o, e, t, r), n)) {
    let s = cs(r, t),
      a = e[J],
      c = ta(a, t[St]);
    c !== null && rm(o, t[Te], a, e, c, s);
  }
  let i = e[Kr];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
var dn = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = Jv;
  let t = e;
  return t;
})();
function Jv() {
  let t = ye();
  return Xv(t, V());
}
var Kv = dn,
  Hd = class extends Kv {
    constructor(e, r, n) {
      super(),
        (this._lContainer = e),
        (this._hostTNode = r),
        (this._hostLView = n);
    }
    get element() {
      return Ao(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new bt(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let e = Gs(this._hostTNode, this._hostLView);
      if (kl(e)) {
        let r = ro(e, this._hostLView),
          n = no(e),
          o = r[_].data[n + 8];
        return new bt(o, r);
      } else return new bt(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(e) {
      let r = Hu(this._lContainer);
      return (r !== null && r[e]) || null;
    }
    get length() {
      return this._lContainer.length - me;
    }
    createEmbeddedView(e, r, n) {
      let o, i;
      typeof n == "number"
        ? (o = n)
        : n != null && ((o = n.index), (i = n.injector));
      let s = Uu(this._lContainer, e.ssrId),
        a = e.createEmbeddedViewImpl(r || {}, i, s);
      return this.insertImpl(a, o, Bu(this._hostTNode, s)), a;
    }
    createComponent(e, r, n, o, i) {
      let s = e && !Sg(e),
        a;
      if (s) a = r;
      else {
        let w = r || {};
        (a = w.index),
          (n = w.injector),
          (o = w.projectableNodes),
          (i = w.environmentInjector || w.ngModuleRef);
      }
      let c = s ? e : new on(ct(e)),
        u = n || this.parentInjector;
      if (!i && c.ngModule == null) {
        let O = (s ? u : this.parentInjector).get(ue, null);
        O && (i = O);
      }
      let l = ct(c.componentType ?? {}),
        d = Uu(this._lContainer, l?.id ?? null),
        f = d?.firstChild ?? null,
        h = c.create(u, o, f, i);
      return this.insertImpl(h.hostView, a, Bu(this._hostTNode, d)), h;
    }
    insert(e, r) {
      return this.insertImpl(e, r, !0);
    }
    insertImpl(e, r, n) {
      let o = e._lView;
      if ($p(o)) {
        let a = this.indexOf(e);
        if (a !== -1) this.detach(a);
        else {
          let c = o[G],
            u = new Hd(c, c[Te], c[G]);
          u.detach(u.indexOf(e));
        }
      }
      let i = this._adjustIndex(r),
        s = this._lContainer;
      return Qv(s, o, i, n), e.attachToViewContainerRef(), ql(Wi(s), i, e), e;
    }
    move(e, r) {
      return this.insert(e, r);
    }
    indexOf(e) {
      let r = Hu(this._lContainer);
      return r !== null ? r.indexOf(e) : -1;
    }
    remove(e) {
      let r = this._adjustIndex(e, -1),
        n = as(this._lContainer, r);
      n && (oo(Wi(this._lContainer), r), ud(n[_], n));
    }
    detach(e) {
      let r = this._adjustIndex(e, -1),
        n = as(this._lContainer, r);
      return n && oo(Wi(this._lContainer), r) != null ? new At(n) : null;
    }
    _adjustIndex(e, r = 0) {
      return e ?? this.length + r;
    }
  };
function Hu(t) {
  return t[Xr];
}
function Wi(t) {
  return t[Xr] || (t[Xr] = []);
}
function Xv(t, e) {
  let r,
    n = e[t.index];
  return (
    Me(n) ? (r = n) : ((r = Rd(n, e, null, t)), (e[t.index] = r), Po(e, r)),
    ty(r, e, t, n),
    new Hd(r, t, e)
  );
}
function ey(t, e) {
  let r = t[J],
    n = r.createComment(""),
    o = ve(e, t),
    i = ta(r, o);
  return ao(r, i, n, hm(r, o), !1), n;
}
var ty = oy,
  ny = (t, e, r) => !1;
function ry(t, e, r) {
  return ny(t, e, r);
}
function oy(t, e, r, n) {
  if (t[St]) return;
  let o;
  r.type & 8 ? (o = Ve(n)) : (o = ey(e, r)), (t[St] = o);
}
function iy(t, e, r, n, o, i, s, a, c) {
  let u = e.consts,
    l = Ro(e, t, 4, s || null, to(u, a));
  Ad(e, r, l, to(u, c)), zs(e, l);
  let d = (l.tView = aa(
    2,
    l,
    n,
    o,
    i,
    e.directiveRegistry,
    e.pipeRegistry,
    null,
    e.schemas,
    u,
    null
  ));
  return (
    e.queries !== null &&
      (e.queries.template(e, l), (d.queries = e.queries.embeddedTView(l))),
    l
  );
}
function Ot(t, e, r, n, o, i, s, a) {
  let c = V(),
    u = ht(),
    l = t + ut,
    d = u.firstCreatePass ? iy(l, u, c, e, r, n, o, i, s) : u.data[l];
  Gn(d, !1);
  let f = sy(u, c, d, t);
  Hs() && na(u, c, f, d), Tt(f, c);
  let h = Rd(f, c, f, d);
  return (
    (c[l] = h),
    Po(c, h),
    ry(h, d, c),
    ks(d) && Sd(u, c, d),
    s != null && xd(c, d, a),
    Ot
  );
}
var sy = ay;
function ay(t, e, r, n) {
  return $s(!0), e[J].createComment("");
}
function cy(t, e, r, n, o, i) {
  let s = e.consts,
    a = to(s, o),
    c = Ro(e, t, 2, n, a);
  return (
    Ad(e, r, c, to(s, i)),
    c.attrs !== null && Ts(c, c.attrs, !1),
    c.mergedAttrs !== null && Ts(c, c.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, c),
    c
  );
}
function F(t, e, r, n) {
  let o = V(),
    i = ht(),
    s = ut + t,
    a = o[J],
    c = i.firstCreatePass ? cy(s, i, o, e, r, n) : i.data[s],
    u = uy(i, o, c, a, e, t);
  o[s] = u;
  let l = ks(c);
  return (
    Gn(c, !0),
    hd(a, u, c),
    (c.flags & 32) !== 32 && Hs() && na(i, o, u, c),
    qp() === 0 && Tt(u, o),
    Zp(),
    l && (Sd(i, o, c), Md(i, c, o)),
    n !== null && xd(o, c),
    F
  );
}
function k() {
  let t = ye();
  Ml() ? eg() : ((t = t.parent), Gn(t, !1));
  let e = t;
  Jp(e) && Kp(), Yp();
  let r = ht();
  return (
    r.firstCreatePass && (zs(r, t), gl(t) && r.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      dg(e) &&
      Vu(r, e, V(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      fg(e) &&
      Vu(r, e, V(), e.stylesWithoutHost, !1),
    k
  );
}
function Je(t, e, r, n) {
  return F(t, e, r, n), k(), Je;
}
var uy = (t, e, r, n, o, i) => ($s(!0), ad(n, o, ag()));
function fn() {
  return V();
}
var po = "en-US";
var ly = po;
function dy(t) {
  ap(t, "Expected localeId to be defined"),
    typeof t == "string" && (ly = t.toLowerCase().replace(/_/g, "-"));
}
function Yn(t) {
  return !!t && typeof t.then == "function";
}
function $d(t) {
  return !!t && typeof t.subscribe == "function";
}
function Ke(t, e, r, n) {
  let o = V(),
    i = ht(),
    s = ye();
  return hy(i, o, o[J], s, t, e, n), Ke;
}
function fy(t, e, r, n) {
  let o = t.cleanup;
  if (o != null)
    for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i];
      if (s === r && o[i + 1] === n) {
        let a = e[Rn],
          c = o[i + 2];
        return a.length > c ? a[c] : null;
      }
      typeof s == "string" && (i += 2);
    }
  return null;
}
function hy(t, e, r, n, o, i, s) {
  let a = ks(n),
    u = t.firstCreatePass && mv(t),
    l = e[be],
    d = gv(e),
    f = !0;
  if (n.type & 3 || s) {
    let O = ve(n, e),
      K = s ? s(O) : O,
      j = d.length,
      se = s ? (Ce) => s(Ve(Ce[n.index])) : n.index,
      Ge = null;
    if ((!s && a && (Ge = fy(t, e, o, n.index)), Ge !== null)) {
      let Ce = Ge.__ngLastListenerFn__ || Ge;
      (Ce.__ngNextListenerFn__ = i), (Ge.__ngLastListenerFn__ = i), (f = !1);
    } else {
      i = zu(n, e, l, i, !1);
      let Ce = r.listen(K, o, i);
      d.push(i, Ce), u && u.push(o, se, j, j + 1);
    }
  } else i = zu(n, e, l, i, !1);
  let h = n.outputs,
    w;
  if (f && h !== null && (w = h[o])) {
    let O = w.length;
    if (O)
      for (let K = 0; K < O; K += 2) {
        let j = w[K],
          se = w[K + 1],
          Oe = e[j][se].subscribe(i),
          We = d.length;
        d.push(i, Oe), u && u.push(o, n.index, We, -(We + 1));
      }
  }
}
function $u(t, e, r, n) {
  try {
    return Fe(6, e, r), r(n) !== !1;
  } catch (o) {
    return Fd(t, o), !1;
  } finally {
    Fe(7, e, r);
  }
}
function zu(t, e, r, n, o) {
  return function i(s) {
    if (s === Function) return n;
    let a = t.componentOffset > -1 ? ft(t.index, e) : e;
    ua(a);
    let c = $u(e, r, n, s),
      u = i.__ngNextListenerFn__;
    for (; u; ) (c = $u(e, r, u, s) && c), (u = u.__ngNextListenerFn__);
    return o && c === !1 && s.preventDefault(), c;
  };
}
function hn(t = 1) {
  return sg(t);
}
function W(t, e = "") {
  let r = V(),
    n = ht(),
    o = t + ut,
    i = n.firstCreatePass ? Ro(n, o, 1, e, null) : n.data[o],
    s = py(n, r, i, e, t);
  (r[o] = s), Hs() && na(n, r, s, i), Gn(i, !1);
}
var py = (t, e, r, n, o) => ($s(!0), em(e[J], n));
function Ne(t, e, r) {
  let n = V(),
    o = qv(n, t, e, r);
  return o !== Zn && vv(n, Bs(), o), Ne;
}
var lt = class {},
  Bn = class {};
var go = class extends lt {
    constructor(e, r, n) {
      super(),
        (this._parent = r),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new ho(this));
      let o = ll(e);
      (this._bootstrapComponents = td(o.bootstrap)),
        (this._r3Injector = Xl(
          e,
          r,
          [
            { provide: lt, useValue: this },
            { provide: To, useValue: this.componentFactoryResolver },
            ...n,
          ],
          ee(e),
          new Set(["environment"])
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(e));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let e = this._r3Injector;
      !e.destroyed && e.destroy(),
        this.destroyCbs.forEach((r) => r()),
        (this.destroyCbs = null);
    }
    onDestroy(e) {
      this.destroyCbs.push(e);
    }
  },
  mo = class extends Bn {
    constructor(e) {
      super(), (this.moduleType = e);
    }
    create(e) {
      return new go(this.moduleType, e, []);
    }
  };
function gy(t, e, r) {
  return new go(t, e, r);
}
var Ns = class extends lt {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new ho(this)),
      (this.instance = null);
    let r = new Vn(
      [
        ...e.providers,
        { provide: lt, useValue: this },
        { provide: To, useValue: this.componentFactoryResolver },
      ],
      e.parent || Qs(),
      e.debugName,
      new Set(["environment"])
    );
    (this.injector = r),
      e.runEnvironmentInitializers && r.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(e) {
    this.injector.onDestroy(e);
  }
};
function ko(t, e, r = null) {
  return new Ns({
    providers: t,
    parent: e,
    debugName: r,
    runEnvironmentInitializers: !0,
  }).injector;
}
var my = (() => {
  let e = class e {
    constructor(n) {
      (this._injector = n), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let o = Ql(!1, n.type),
          i =
            o.length > 0
              ? ko([o], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, i);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  e.ɵprov = y({
    token: e,
    providedIn: "environment",
    factory: () => new e(v(ue)),
  });
  let t = e;
  return t;
})();
function zd(t) {
  la("NgStandalone"),
    (t.getStandaloneInjector = (e) =>
      e.get(my).getOrCreateStandaloneInjector(t));
}
function Lo(t, e, r, n) {
  return vy(V(), Sl(), t, e, r, n);
}
function jo(t, e, r, n, o) {
  return yy(V(), Sl(), t, e, r, n, o);
}
function Gd(t, e) {
  let r = t[e];
  return r === Zn ? void 0 : r;
}
function vy(t, e, r, n, o, i) {
  let s = e + r;
  return sn(t, s, o) ? Bd(t, s + 1, i ? n.call(i, o) : n(o)) : Gd(t, s + 1);
}
function yy(t, e, r, n, o, i, s) {
  let a = e + r;
  return Wv(t, a, o, i)
    ? Bd(t, a + 2, s ? n.call(s, o, i) : n(o, i))
    : Gd(t, a + 2);
}
var Vo = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = wy;
    let t = e;
    return t;
  })(),
  Dy = Vo,
  Cy = class extends Dy {
    constructor(e, r, n) {
      super(),
        (this._declarationLView = e),
        (this._declarationTContainer = r),
        (this.elementRef = n);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(e, r) {
      return this.createEmbeddedViewImpl(e, r);
    }
    createEmbeddedViewImpl(e, r, n) {
      let o = Yv(this._declarationLView, this._declarationTContainer, e, {
        injector: r,
        dehydratedView: n,
      });
      return new At(o);
    }
  };
function wy() {
  return Ey(ye(), V());
}
function Ey(t, e) {
  return t.type & 4 ? new Cy(e, t, Ao(t, e)) : null;
}
var zr = null;
function Iy(t) {
  (zr !== null &&
    (t.defaultEncapsulation !== zr.defaultEncapsulation ||
      t.preserveWhitespaces !== zr.preserveWhitespaces)) ||
    (zr = t);
}
var Uo = (() => {
    let e = class e {
      log(n) {
        console.log(n);
      }
      warn(n) {
        console.warn(n);
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  Os = class {
    constructor(e, r) {
      (this.ngModuleFactory = e), (this.componentFactories = r);
    }
  },
  Bo = (() => {
    let e = class e {
      compileModuleSync(n) {
        return new mo(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let o = this.compileModuleSync(n),
          i = ll(n),
          s = td(i.declarations).reduce((a, c) => {
            let u = ct(c);
            return u && a.push(new on(u)), a;
          }, []);
        return new Os(o, s);
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
    };
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  by = new I("compilerOptions");
var Ho = (() => {
  let e = class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new Q(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let n = this.taskId++;
      return this.pendingTasks.add(n), n;
    }
    remove(n) {
      this.pendingTasks.delete(n),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
  };
  (e.ɵfac = function (o) {
    return new (o || e)();
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var ma = new I(""),
  Qn = new I(""),
  $o = (() => {
    let e = class e {
      constructor(n, o, i) {
        (this._ngZone = n),
          (this.registry = o),
          (this._pendingCount = 0),
          (this._isZoneStable = !0),
          (this._didWork = !1),
          (this._callbacks = []),
          (this.taskTrackingZone = null),
          va || (My(i), i.addToWindow(o)),
          this._watchAngularEvents(),
          n.run(() => {
            this.taskTrackingZone =
              typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone");
          });
      }
      _watchAngularEvents() {
        this._ngZone.onUnstable.subscribe({
          next: () => {
            (this._didWork = !0), (this._isZoneStable = !1);
          },
        }),
          this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.subscribe({
              next: () => {
                L.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    (this._isZoneStable = !0), this._runCallbacksIfReady();
                  });
              },
            });
          });
      }
      increasePendingRequestCount() {
        return (
          (this._pendingCount += 1), (this._didWork = !0), this._pendingCount
        );
      }
      decreasePendingRequestCount() {
        if (((this._pendingCount -= 1), this._pendingCount < 0))
          throw new Error("pending async requests below zero");
        return this._runCallbacksIfReady(), this._pendingCount;
      }
      isStable() {
        return (
          this._isZoneStable &&
          this._pendingCount === 0 &&
          !this._ngZone.hasPendingMacrotasks
        );
      }
      _runCallbacksIfReady() {
        if (this.isStable())
          queueMicrotask(() => {
            for (; this._callbacks.length !== 0; ) {
              let n = this._callbacks.pop();
              clearTimeout(n.timeoutId), n.doneCb(this._didWork);
            }
            this._didWork = !1;
          });
        else {
          let n = this.getPendingTasks();
          (this._callbacks = this._callbacks.filter((o) =>
            o.updateCb && o.updateCb(n) ? (clearTimeout(o.timeoutId), !1) : !0
          )),
            (this._didWork = !0);
        }
      }
      getPendingTasks() {
        return this.taskTrackingZone
          ? this.taskTrackingZone.macroTasks.map((n) => ({
              source: n.source,
              creationLocation: n.creationLocation,
              data: n.data,
            }))
          : [];
      }
      addCallback(n, o, i) {
        let s = -1;
        o &&
          o > 0 &&
          (s = setTimeout(() => {
            (this._callbacks = this._callbacks.filter(
              (a) => a.timeoutId !== s
            )),
              n(this._didWork, this.getPendingTasks());
          }, o)),
          this._callbacks.push({ doneCb: n, timeoutId: s, updateCb: i });
      }
      whenStable(n, o, i) {
        if (i && !this.taskTrackingZone)
          throw new Error(
            'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
          );
        this.addCallback(n, o, i), this._runCallbacksIfReady();
      }
      getPendingRequestCount() {
        return this._pendingCount;
      }
      registerApplication(n) {
        this.registry.registerApplication(n, this);
      }
      unregisterApplication(n) {
        this.registry.unregisterApplication(n);
      }
      findProviders(n, o, i) {
        return [];
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)(v(L), v(zo), v(Qn));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  zo = (() => {
    let e = class e {
      constructor() {
        this._applications = new Map();
      }
      registerApplication(n, o) {
        this._applications.set(n, o);
      }
      unregisterApplication(n) {
        this._applications.delete(n);
      }
      unregisterAllApplications() {
        this._applications.clear();
      }
      getTestability(n) {
        return this._applications.get(n) || null;
      }
      getAllTestabilities() {
        return Array.from(this._applications.values());
      }
      getAllRootElements() {
        return Array.from(this._applications.keys());
      }
      findTestabilityInTree(n, o = !0) {
        return va?.findTestabilityInTree(this, n, o) ?? null;
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })();
function My(t) {
  va = t;
}
var va,
  Go = new I("Application Initializer"),
  Wd = (() => {
    let e = class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, o) => {
            (this.resolve = n), (this.reject = o);
          })),
          (this.appInits = p(Go, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let i of this.appInits) {
          let s = i();
          if (Yn(s)) n.push(s);
          else if ($d(s)) {
            let a = new Promise((c, u) => {
              s.subscribe({ complete: c, error: u });
            });
            n.push(a);
          }
        }
        let o = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            o();
          })
          .catch((i) => {
            this.reject(i);
          }),
          n.length === 0 && o(),
          (this.initialized = !0);
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  ya = new I("appBootstrapListener");
function Sy(t, e, r) {
  let n = new mo(r);
  return Promise.resolve(n);
}
function xy() {
  Rc(() => {
    throw new m(600, !1);
  });
}
function Ty(t) {
  return t.isBoundToModule;
}
function Ay(t, e, r) {
  try {
    let n = r();
    return Yn(n)
      ? n.catch((o) => {
          throw (e.runOutsideAngular(() => t.handleError(o)), o);
        })
      : n;
  } catch (n) {
    throw (e.runOutsideAngular(() => t.handleError(n)), n);
  }
}
function qd(t, e) {
  return Array.isArray(e) ? e.reduce(qd, t) : g(g({}, t), e);
}
var pn = (() => {
  let e = class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = p(Dd)),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = p(Ho).hasPendingTasks.pipe(A((n) => !n))),
        (this._injector = p(ue));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(n, o) {
      let i = n instanceof uo;
      if (!this._injector.get(Wd).done) {
        let w =
          "Cannot bootstrap as there are still asynchronous initializers running." +
          (!i && ul(n)
            ? ""
            : " Bootstrap components in the `ngDoBootstrap` method of the root module.");
        throw new m(405, !1);
      }
      let a;
      i ? (a = n) : (a = this._injector.get(To).resolveComponentFactory(n)),
        this.componentTypes.push(a.componentType);
      let c = Ty(a) ? void 0 : this._injector.get(lt),
        u = o || a.selector,
        l = a.create(Ae.NULL, [], u, c),
        d = l.location.nativeElement,
        f = l.injector.get(ma, null);
      return (
        f?.registerApplication(d),
        l.onDestroy(() => {
          this.detachView(l.hostView),
            Yr(this.components, l),
            f?.unregisterApplication(d);
        }),
        this._loadComponent(l),
        l
      );
    }
    tick() {
      if (this._runningTick) throw new m(101, !1);
      try {
        this._runningTick = !0;
        for (let n of this._views) n.detectChanges();
      } catch (n) {
        this.internalErrorHandler(n);
      } finally {
        this._runningTick = !1;
      }
    }
    attachView(n) {
      let o = n;
      this._views.push(o), o.attachToAppRef(this);
    }
    detachView(n) {
      let o = n;
      Yr(this._views, o), o.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n);
      let o = this._injector.get(ya, []);
      [...this._bootstrapListeners, ...o].forEach((i) => i(n));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(n) {
      return (
        this._destroyListeners.push(n), () => Yr(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new m(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (e.ɵfac = function (o) {
    return new (o || e)();
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function Yr(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function Gu(t) {
  for (let e = t.length - 1; e >= 0; e--) if (t[e] !== void 0) return t[e];
}
var _y = (() => {
  let e = class e {
    constructor() {
      (this.zone = p(L)), (this.applicationRef = p(pn));
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick();
              });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
  };
  (e.ɵfac = function (o) {
    return new (o || e)();
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function Ny(t) {
  return [
    { provide: L, useFactory: t },
    {
      provide: rn,
      multi: !0,
      useFactory: () => {
        let e = p(_y, { optional: !0 });
        return () => e.initialize();
      },
    },
    {
      provide: rn,
      multi: !0,
      useFactory: () => {
        let e = p(Py);
        return () => {
          e.initialize();
        };
      },
    },
    { provide: Dd, useFactory: Oy },
  ];
}
function Oy() {
  let t = p(L),
    e = p(Ue);
  return (r) => t.runOutsideAngular(() => e.handleError(r));
}
function Ry(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
var Py = (() => {
  let e = class e {
    constructor() {
      (this.subscription = new z()),
        (this.initialized = !1),
        (this.zone = p(L)),
        (this.pendingTasks = p(Ho));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              L.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            L.assertInAngularZone(), (n ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  };
  (e.ɵfac = function (o) {
    return new (o || e)();
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function Fy() {
  return (typeof $localize < "u" && $localize.locale) || po;
}
var Da = new I("LocaleId", {
  providedIn: "root",
  factory: () => p(Da, M.Optional | M.SkipSelf) || Fy(),
});
var Zd = new I("PlatformDestroyListeners"),
  Yd = (() => {
    let e = class e {
      constructor(n) {
        (this._injector = n),
          (this._modules = []),
          (this._destroyListeners = []),
          (this._destroyed = !1);
      }
      bootstrapModuleFactory(n, o) {
        let i = Rv(
          o?.ngZone,
          Ry({
            eventCoalescing: o?.ngZoneEventCoalescing,
            runCoalescing: o?.ngZoneRunCoalescing,
          })
        );
        return i.run(() => {
          let s = gy(
              n.moduleType,
              this.injector,
              Ny(() => i)
            ),
            a = s.injector.get(Ue, null);
          return (
            i.runOutsideAngular(() => {
              let c = i.onError.subscribe({
                next: (u) => {
                  a.handleError(u);
                },
              });
              s.onDestroy(() => {
                Yr(this._modules, s), c.unsubscribe();
              });
            }),
            Ay(a, i, () => {
              let c = s.injector.get(Wd);
              return (
                c.runInitializers(),
                c.donePromise.then(() => {
                  let u = s.injector.get(Da, po);
                  return dy(u || po), this._moduleDoBootstrap(s), s;
                })
              );
            })
          );
        });
      }
      bootstrapModule(n, o = []) {
        let i = qd({}, o);
        return Sy(this.injector, i, n).then((s) =>
          this.bootstrapModuleFactory(s, i)
        );
      }
      _moduleDoBootstrap(n) {
        let o = n.injector.get(pn);
        if (n._bootstrapComponents.length > 0)
          n._bootstrapComponents.forEach((i) => o.bootstrap(i));
        else if (n.instance.ngDoBootstrap) n.instance.ngDoBootstrap(o);
        else throw new m(-403, !1);
        this._modules.push(n);
      }
      onDestroy(n) {
        this._destroyListeners.push(n);
      }
      get injector() {
        return this._injector;
      }
      destroy() {
        if (this._destroyed) throw new m(404, !1);
        this._modules.slice().forEach((o) => o.destroy()),
          this._destroyListeners.forEach((o) => o());
        let n = this._injector.get(Zd, null);
        n && (n.forEach((o) => o()), n.clear()), (this._destroyed = !0);
      }
      get destroyed() {
        return this._destroyed;
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)(v(Ae));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  _n = null,
  Qd = new I("AllowMultipleToken");
function ky(t) {
  if (_n && !_n.get(Qd, !1)) throw new m(400, !1);
  xy(), (_n = t);
  let e = t.get(Yd);
  return Vy(t), e;
}
function Ca(t, e, r = []) {
  let n = `Platform: ${e}`,
    o = new I(n);
  return (i = []) => {
    let s = Jd();
    if (!s || s.injector.get(Qd, !1)) {
      let a = [...r, ...i, { provide: o, useValue: !0 }];
      t ? t(a) : ky(Ly(a, n));
    }
    return jy(o);
  };
}
function Ly(t = [], e) {
  return Ae.create({
    name: e,
    providers: [
      { provide: bo, useValue: "platform" },
      { provide: Zd, useValue: new Set([() => (_n = null)]) },
      ...t,
    ],
  });
}
function jy(t) {
  let e = Jd();
  if (!e) throw new m(401, !1);
  return e;
}
function Jd() {
  return _n?.get(Yd) ?? null;
}
function Vy(t) {
  t.get(Js, null)?.forEach((r) => r());
}
var Kd = Ca(null, "core", []),
  Xd = (() => {
    let e = class e {
      constructor(n) {}
    };
    (e.ɵfac = function (o) {
      return new (o || e)(v(pn));
    }),
      (e.ɵmod = xe({ type: e })),
      (e.ɵinj = Se({}));
    let t = e;
    return t;
  })();
function Jn(t) {
  return typeof t == "boolean" ? t : t != null && t !== "false";
}
function ef(t) {
  let e = ct(t);
  if (!e) return null;
  let r = new on(e);
  return {
    get selector() {
      return r.selector;
    },
    get type() {
      return r.componentType;
    },
    get inputs() {
      return r.inputs;
    },
    get outputs() {
      return r.outputs;
    },
    get ngContentSelectors() {
      return r.ngContentSelectors;
    },
    get isStandalone() {
      return e.standalone;
    },
    get isSignal() {
      return e.signals;
    },
  };
}
var Ea = null;
function Rt() {
  return Ea;
}
function cf(t) {
  Ea || (Ea = t);
}
var Wo = class {},
  ne = new I("DocumentToken"),
  Sa = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error("Not implemented");
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵprov = y({
        token: e,
        factory: () => (() => p(Uy))(),
        providedIn: "platform",
      }));
    let t = e;
    return t;
  })(),
  uf = new I("Location Initialized"),
  Uy = (() => {
    let e = class e extends Sa {
      constructor() {
        super(),
          (this._doc = p(ne)),
          (this._location = window.location),
          (this._history = window.history);
      }
      getBaseHrefFromDOM() {
        return Rt().getBaseHref(this._doc);
      }
      onPopState(n) {
        let o = Rt().getGlobalEventTarget(this._doc, "window");
        return (
          o.addEventListener("popstate", n, !1),
          () => o.removeEventListener("popstate", n)
        );
      }
      onHashChange(n) {
        let o = Rt().getGlobalEventTarget(this._doc, "window");
        return (
          o.addEventListener("hashchange", n, !1),
          () => o.removeEventListener("hashchange", n)
        );
      }
      get href() {
        return this._location.href;
      }
      get protocol() {
        return this._location.protocol;
      }
      get hostname() {
        return this._location.hostname;
      }
      get port() {
        return this._location.port;
      }
      get pathname() {
        return this._location.pathname;
      }
      get search() {
        return this._location.search;
      }
      get hash() {
        return this._location.hash;
      }
      set pathname(n) {
        this._location.pathname = n;
      }
      pushState(n, o, i) {
        this._history.pushState(n, o, i);
      }
      replaceState(n, o, i) {
        this._history.replaceState(n, o, i);
      }
      forward() {
        this._history.forward();
      }
      back() {
        this._history.back();
      }
      historyGo(n = 0) {
        this._history.go(n);
      }
      getState() {
        return this._history.state;
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵprov = y({
        token: e,
        factory: () => (() => new e())(),
        providedIn: "platform",
      }));
    let t = e;
    return t;
  })();
function xa(t, e) {
  if (t.length == 0) return e;
  if (e.length == 0) return t;
  let r = 0;
  return (
    t.endsWith("/") && r++,
    e.startsWith("/") && r++,
    r == 2 ? t + e.substring(1) : r == 1 ? t + e : t + "/" + e
  );
}
function tf(t) {
  let e = t.match(/#|\?|$/),
    r = (e && e.index) || t.length,
    n = r - (t[r - 1] === "/" ? 1 : 0);
  return t.slice(0, n) + t.slice(r);
}
function et(t) {
  return t && t[0] !== "?" ? "?" + t : t;
}
var tt = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error("Not implemented");
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵprov = y({
        token: e,
        factory: () => (() => p(Ta))(),
        providedIn: "root",
      }));
    let t = e;
    return t;
  })(),
  lf = new I("appBaseHref"),
  Ta = (() => {
    let e = class e extends tt {
      constructor(n, o) {
        super(),
          (this._platformLocation = n),
          (this._removeListenerFns = []),
          (this._baseHref =
            o ??
            this._platformLocation.getBaseHrefFromDOM() ??
            p(ne).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(n) {
        return xa(this._baseHref, n);
      }
      path(n = !1) {
        let o =
            this._platformLocation.pathname + et(this._platformLocation.search),
          i = this._platformLocation.hash;
        return i && n ? `${o}${i}` : o;
      }
      pushState(n, o, i, s) {
        let a = this.prepareExternalUrl(i + et(s));
        this._platformLocation.pushState(n, o, a);
      }
      replaceState(n, o, i, s) {
        let a = this.prepareExternalUrl(i + et(s));
        this._platformLocation.replaceState(n, o, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)(v(Sa), v(lf, 8));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  df = (() => {
    let e = class e extends tt {
      constructor(n, o) {
        super(),
          (this._platformLocation = n),
          (this._baseHref = ""),
          (this._removeListenerFns = []),
          o != null && (this._baseHref = o);
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      path(n = !1) {
        let o = this._platformLocation.hash;
        return o == null && (o = "#"), o.length > 0 ? o.substring(1) : o;
      }
      prepareExternalUrl(n) {
        let o = xa(this._baseHref, n);
        return o.length > 0 ? "#" + o : o;
      }
      pushState(n, o, i, s) {
        let a = this.prepareExternalUrl(i + et(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.pushState(n, o, a);
      }
      replaceState(n, o, i, s) {
        let a = this.prepareExternalUrl(i + et(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.replaceState(n, o, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)(v(Sa), v(lf, 8));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  gn = (() => {
    let e = class e {
      constructor(n) {
        (this._subject = new X()),
          (this._urlChangeListeners = []),
          (this._urlChangeSubscription = null),
          (this._locationStrategy = n);
        let o = this._locationStrategy.getBaseHref();
        (this._basePath = $y(tf(nf(o)))),
          this._locationStrategy.onPopState((i) => {
            this._subject.emit({
              url: this.path(!0),
              pop: !0,
              state: i.state,
              type: i.type,
            });
          });
      }
      ngOnDestroy() {
        this._urlChangeSubscription?.unsubscribe(),
          (this._urlChangeListeners = []);
      }
      path(n = !1) {
        return this.normalize(this._locationStrategy.path(n));
      }
      getState() {
        return this._locationStrategy.getState();
      }
      isCurrentPathEqualTo(n, o = "") {
        return this.path() == this.normalize(n + et(o));
      }
      normalize(n) {
        return e.stripTrailingSlash(Hy(this._basePath, nf(n)));
      }
      prepareExternalUrl(n) {
        return (
          n && n[0] !== "/" && (n = "/" + n),
          this._locationStrategy.prepareExternalUrl(n)
        );
      }
      go(n, o = "", i = null) {
        this._locationStrategy.pushState(i, "", n, o),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + et(o)), i);
      }
      replaceState(n, o = "", i = null) {
        this._locationStrategy.replaceState(i, "", n, o),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + et(o)), i);
      }
      forward() {
        this._locationStrategy.forward();
      }
      back() {
        this._locationStrategy.back();
      }
      historyGo(n = 0) {
        this._locationStrategy.historyGo?.(n);
      }
      onUrlChange(n) {
        return (
          this._urlChangeListeners.push(n),
          this._urlChangeSubscription ||
            (this._urlChangeSubscription = this.subscribe((o) => {
              this._notifyUrlChangeListeners(o.url, o.state);
            })),
          () => {
            let o = this._urlChangeListeners.indexOf(n);
            this._urlChangeListeners.splice(o, 1),
              this._urlChangeListeners.length === 0 &&
                (this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeSubscription = null));
          }
        );
      }
      _notifyUrlChangeListeners(n = "", o) {
        this._urlChangeListeners.forEach((i) => i(n, o));
      }
      subscribe(n, o, i) {
        return this._subject.subscribe({ next: n, error: o, complete: i });
      }
    };
    (e.normalizeQueryParams = et),
      (e.joinWithSlash = xa),
      (e.stripTrailingSlash = tf),
      (e.ɵfac = function (o) {
        return new (o || e)(v(tt));
      }),
      (e.ɵprov = y({ token: e, factory: () => By(), providedIn: "root" }));
    let t = e;
    return t;
  })();
function By() {
  return new gn(v(tt));
}
function Hy(t, e) {
  if (!t || !e.startsWith(t)) return e;
  let r = e.substring(t.length);
  return r === "" || ["/", ";", "?", "#"].includes(r[0]) ? r : e;
}
function nf(t) {
  return t.replace(/\/index.html$/, "");
}
function $y(t) {
  if (new RegExp("^(https?:)?//").test(t)) {
    let [, r] = t.split(/\/\/[^\/]+/);
    return r;
  }
  return t;
}
function ff(t, e) {
  e = encodeURIComponent(e);
  for (let r of t.split(";")) {
    let n = r.indexOf("="),
      [o, i] = n == -1 ? [r, ""] : [r.slice(0, n), r.slice(n + 1)];
    if (o.trim() === e) return decodeURIComponent(i);
  }
  return null;
}
var wa = /\s+/,
  rf = [],
  Zo = (() => {
    let e = class e {
      constructor(n, o, i, s) {
        (this._iterableDiffers = n),
          (this._keyValueDiffers = o),
          (this._ngEl = i),
          (this._renderer = s),
          (this.initialClasses = rf),
          (this.stateMap = new Map());
      }
      set klass(n) {
        this.initialClasses = n != null ? n.trim().split(wa) : rf;
      }
      set ngClass(n) {
        this.rawClass = typeof n == "string" ? n.trim().split(wa) : n;
      }
      ngDoCheck() {
        for (let o of this.initialClasses) this._updateState(o, !0);
        let n = this.rawClass;
        if (Array.isArray(n) || n instanceof Set)
          for (let o of n) this._updateState(o, !0);
        else if (n != null)
          for (let o of Object.keys(n)) this._updateState(o, !!n[o]);
        this._applyStateDiff();
      }
      _updateState(n, o) {
        let i = this.stateMap.get(n);
        i !== void 0
          ? (i.enabled !== o && ((i.changed = !0), (i.enabled = o)),
            (i.touched = !0))
          : this.stateMap.set(n, { enabled: o, changed: !0, touched: !0 });
      }
      _applyStateDiff() {
        for (let n of this.stateMap) {
          let o = n[0],
            i = n[1];
          i.changed
            ? (this._toggleClass(o, i.enabled), (i.changed = !1))
            : i.touched ||
              (i.enabled && this._toggleClass(o, !1), this.stateMap.delete(o)),
            (i.touched = !1);
        }
      }
      _toggleClass(n, o) {
        (n = n.trim()),
          n.length > 0 &&
            n.split(wa).forEach((i) => {
              o
                ? this._renderer.addClass(this._ngEl.nativeElement, i)
                : this._renderer.removeClass(this._ngEl.nativeElement, i);
            });
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)(U(_o), U(No), U(Nt), U(ln));
    }),
      (e.ɵdir = dt({
        type: e,
        selectors: [["", "ngClass", ""]],
        inputs: { klass: ["class", "klass"], ngClass: "ngClass" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
var Ia = class {
    constructor(e, r, n, o) {
      (this.$implicit = e),
        (this.ngForOf = r),
        (this.index = n),
        (this.count = o);
    }
    get first() {
      return this.index === 0;
    }
    get last() {
      return this.index === this.count - 1;
    }
    get even() {
      return this.index % 2 === 0;
    }
    get odd() {
      return !this.even;
    }
  },
  Yo = (() => {
    let e = class e {
      set ngForOf(n) {
        (this._ngForOf = n), (this._ngForOfDirty = !0);
      }
      set ngForTrackBy(n) {
        this._trackByFn = n;
      }
      get ngForTrackBy() {
        return this._trackByFn;
      }
      constructor(n, o, i) {
        (this._viewContainer = n),
          (this._template = o),
          (this._differs = i),
          (this._ngForOf = null),
          (this._ngForOfDirty = !0),
          (this._differ = null);
      }
      set ngForTemplate(n) {
        n && (this._template = n);
      }
      ngDoCheck() {
        if (this._ngForOfDirty) {
          this._ngForOfDirty = !1;
          let n = this._ngForOf;
          if (!this._differ && n)
            if (!1)
              try {
              } catch {}
            else this._differ = this._differs.find(n).create(this.ngForTrackBy);
        }
        if (this._differ) {
          let n = this._differ.diff(this._ngForOf);
          n && this._applyChanges(n);
        }
      }
      _applyChanges(n) {
        let o = this._viewContainer;
        n.forEachOperation((i, s, a) => {
          if (i.previousIndex == null)
            o.createEmbeddedView(
              this._template,
              new Ia(i.item, this._ngForOf, -1, -1),
              a === null ? void 0 : a
            );
          else if (a == null) o.remove(s === null ? void 0 : s);
          else if (s !== null) {
            let c = o.get(s);
            o.move(c, a), of(c, i);
          }
        });
        for (let i = 0, s = o.length; i < s; i++) {
          let c = o.get(i).context;
          (c.index = i), (c.count = s), (c.ngForOf = this._ngForOf);
        }
        n.forEachIdentityChange((i) => {
          let s = o.get(i.currentIndex);
          of(s, i);
        });
      }
      static ngTemplateContextGuard(n, o) {
        return !0;
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)(U(dn), U(Vo), U(_o));
    }),
      (e.ɵdir = dt({
        type: e,
        selectors: [["", "ngFor", "", "ngForOf", ""]],
        inputs: {
          ngForOf: "ngForOf",
          ngForTrackBy: "ngForTrackBy",
          ngForTemplate: "ngForTemplate",
        },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
function of(t, e) {
  t.context.$implicit = e.item;
}
var Qo = (() => {
    let e = class e {
      constructor(n, o) {
        (this._viewContainer = n),
          (this._context = new ba()),
          (this._thenTemplateRef = null),
          (this._elseTemplateRef = null),
          (this._thenViewRef = null),
          (this._elseViewRef = null),
          (this._thenTemplateRef = o);
      }
      set ngIf(n) {
        (this._context.$implicit = this._context.ngIf = n), this._updateView();
      }
      set ngIfThen(n) {
        sf("ngIfThen", n),
          (this._thenTemplateRef = n),
          (this._thenViewRef = null),
          this._updateView();
      }
      set ngIfElse(n) {
        sf("ngIfElse", n),
          (this._elseTemplateRef = n),
          (this._elseViewRef = null),
          this._updateView();
      }
      _updateView() {
        this._context.$implicit
          ? this._thenViewRef ||
            (this._viewContainer.clear(),
            (this._elseViewRef = null),
            this._thenTemplateRef &&
              (this._thenViewRef = this._viewContainer.createEmbeddedView(
                this._thenTemplateRef,
                this._context
              )))
          : this._elseViewRef ||
            (this._viewContainer.clear(),
            (this._thenViewRef = null),
            this._elseTemplateRef &&
              (this._elseViewRef = this._viewContainer.createEmbeddedView(
                this._elseTemplateRef,
                this._context
              )));
      }
      static ngTemplateContextGuard(n, o) {
        return !0;
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)(U(dn), U(Vo));
    }),
      (e.ɵdir = dt({
        type: e,
        selectors: [["", "ngIf", ""]],
        inputs: { ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })(),
  ba = class {
    constructor() {
      (this.$implicit = null), (this.ngIf = null);
    }
  };
function sf(t, e) {
  if (!!!(!e || e.createEmbeddedView))
    throw new Error(`${t} must be a TemplateRef, but received '${ee(e)}'.`);
}
var Jo = (() => {
  let e = class e {
    constructor(n, o, i) {
      (this._ngEl = n),
        (this._differs = o),
        (this._renderer = i),
        (this._ngStyle = null),
        (this._differ = null);
    }
    set ngStyle(n) {
      (this._ngStyle = n),
        !this._differ && n && (this._differ = this._differs.find(n).create());
    }
    ngDoCheck() {
      if (this._differ) {
        let n = this._differ.diff(this._ngStyle);
        n && this._applyChanges(n);
      }
    }
    _setStyle(n, o) {
      let [i, s] = n.split("."),
        a = i.indexOf("-") === -1 ? void 0 : gt.DashCase;
      o != null
        ? this._renderer.setStyle(
            this._ngEl.nativeElement,
            i,
            s ? `${o}${s}` : o,
            a
          )
        : this._renderer.removeStyle(this._ngEl.nativeElement, i, a);
    }
    _applyChanges(n) {
      n.forEachRemovedItem((o) => this._setStyle(o.key, null)),
        n.forEachAddedItem((o) => this._setStyle(o.key, o.currentValue)),
        n.forEachChangedItem((o) => this._setStyle(o.key, o.currentValue));
    }
  };
  (e.ɵfac = function (o) {
    return new (o || e)(U(Nt), U(No), U(ln));
  }),
    (e.ɵdir = dt({
      type: e,
      selectors: [["", "ngStyle", ""]],
      inputs: { ngStyle: "ngStyle" },
      standalone: !0,
    }));
  let t = e;
  return t;
})();
var hf = (() => {
    let e = class e {};
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵmod = xe({ type: e })),
      (e.ɵinj = Se({}));
    let t = e;
    return t;
  })(),
  pf = "browser",
  zy = "server";
function Aa(t) {
  return t === zy;
}
var gf = (() => {
    let e = class e {};
    e.ɵprov = y({
      token: e,
      providedIn: "root",
      factory: () => new Ma(v(ne), window),
    });
    let t = e;
    return t;
  })(),
  Ma = class {
    constructor(e, r) {
      (this.document = e), (this.window = r), (this.offset = () => [0, 0]);
    }
    setOffset(e) {
      Array.isArray(e) ? (this.offset = () => e) : (this.offset = e);
    }
    getScrollPosition() {
      return this.supportsScrolling()
        ? [this.window.pageXOffset, this.window.pageYOffset]
        : [0, 0];
    }
    scrollToPosition(e) {
      this.supportsScrolling() && this.window.scrollTo(e[0], e[1]);
    }
    scrollToAnchor(e) {
      if (!this.supportsScrolling()) return;
      let r = Gy(this.document, e);
      r && (this.scrollToElement(r), r.focus());
    }
    setHistoryScrollRestoration(e) {
      this.supportsScrolling() && (this.window.history.scrollRestoration = e);
    }
    scrollToElement(e) {
      let r = e.getBoundingClientRect(),
        n = r.left + this.window.pageXOffset,
        o = r.top + this.window.pageYOffset,
        i = this.offset();
      this.window.scrollTo(n - i[0], o - i[1]);
    }
    supportsScrolling() {
      try {
        return (
          !!this.window &&
          !!this.window.scrollTo &&
          "pageXOffset" in this.window
        );
      } catch {
        return !1;
      }
    }
  };
function Gy(t, e) {
  let r = t.getElementById(e) || t.getElementsByName(e)[0];
  if (r) return r;
  if (
    typeof t.createTreeWalker == "function" &&
    t.body &&
    typeof t.body.attachShadow == "function"
  ) {
    let n = t.createTreeWalker(t.body, NodeFilter.SHOW_ELEMENT),
      o = n.currentNode;
    for (; o; ) {
      let i = o.shadowRoot;
      if (i) {
        let s = i.getElementById(e) || i.querySelector(`[name="${e}"]`);
        if (s) return s;
      }
      o = n.nextNode();
    }
  }
  return null;
}
var qo = class {};
var Ra = class extends Wo {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  Pa = class t extends Ra {
    static makeCurrent() {
      cf(new t());
    }
    onAndCancel(e, r, n) {
      return (
        e.addEventListener(r, n),
        () => {
          e.removeEventListener(r, n);
        }
      );
    }
    dispatchEvent(e, r) {
      e.dispatchEvent(r);
    }
    remove(e) {
      e.parentNode && e.parentNode.removeChild(e);
    }
    createElement(e, r) {
      return (r = r || this.getDefaultDocument()), r.createElement(e);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(e) {
      return e.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(e) {
      return e instanceof DocumentFragment;
    }
    getGlobalEventTarget(e, r) {
      return r === "window"
        ? window
        : r === "document"
        ? e
        : r === "body"
        ? e.body
        : null;
    }
    getBaseHref(e) {
      let r = qy();
      return r == null ? null : Zy(r);
    }
    resetBaseElement() {
      Kn = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(e) {
      return ff(document.cookie, e);
    }
  },
  Kn = null;
function qy() {
  return (
    (Kn = Kn || document.querySelector("base")),
    Kn ? Kn.getAttribute("href") : null
  );
}
function Zy(t) {
  return new URL(t, document.baseURI).pathname;
}
var Fa = class {
    addToWindow(e) {
      (te.getAngularTestability = (n, o = !0) => {
        let i = e.findTestabilityInTree(n, o);
        if (i == null) throw new m(5103, !1);
        return i;
      }),
        (te.getAllAngularTestabilities = () => e.getAllTestabilities()),
        (te.getAllAngularRootElements = () => e.getAllRootElements());
      let r = (n) => {
        let o = te.getAllAngularTestabilities(),
          i = o.length,
          s = !1,
          a = function (c) {
            (s = s || c), i--, i == 0 && n(s);
          };
        o.forEach((c) => {
          c.whenStable(a);
        });
      };
      te.frameworkStabilizers || (te.frameworkStabilizers = []),
        te.frameworkStabilizers.push(r);
    }
    findTestabilityInTree(e, r, n) {
      if (r == null) return null;
      let o = e.getTestability(r);
      return (
        o ??
        (n
          ? Rt().isShadowRoot(r)
            ? this.findTestabilityInTree(e, r.host, !0)
            : this.findTestabilityInTree(e, r.parentElement, !0)
          : null)
      );
    }
  },
  Yy = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest();
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  ka = new I("EventManagerPlugins"),
  Df = (() => {
    let e = class e {
      constructor(n, o) {
        (this._zone = o),
          (this._eventNameToPlugin = new Map()),
          n.forEach((i) => {
            i.manager = this;
          }),
          (this._plugins = n.slice().reverse());
      }
      addEventListener(n, o, i) {
        return this._findPluginFor(o).addEventListener(n, o, i);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let o = this._eventNameToPlugin.get(n);
        if (o) return o;
        if (((o = this._plugins.find((s) => s.supports(n))), !o))
          throw new m(5101, !1);
        return this._eventNameToPlugin.set(n, o), o;
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)(v(ka), v(L));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Ko = class {
    constructor(e) {
      this._doc = e;
    }
  },
  Na = "ng-app-id",
  Cf = (() => {
    let e = class e {
      constructor(n, o, i, s = {}) {
        (this.doc = n),
          (this.appId = o),
          (this.nonce = i),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = Aa(s)),
          this.resetHostNodes();
      }
      addStyles(n) {
        for (let o of n)
          this.changeUsageCount(o, 1) === 1 && this.onStyleAdded(o);
      }
      removeStyles(n) {
        for (let o of n)
          this.changeUsageCount(o, -1) <= 0 && this.onStyleRemoved(o);
      }
      ngOnDestroy() {
        let n = this.styleNodesInDOM;
        n && (n.forEach((o) => o.remove()), n.clear());
        for (let o of this.getAllStyles()) this.onStyleRemoved(o);
        this.resetHostNodes();
      }
      addHost(n) {
        this.hostNodes.add(n);
        for (let o of this.getAllStyles()) this.addStyleToHost(n, o);
      }
      removeHost(n) {
        this.hostNodes.delete(n);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(n) {
        for (let o of this.hostNodes) this.addStyleToHost(o, n);
      }
      onStyleRemoved(n) {
        let o = this.styleRef;
        o.get(n)?.elements?.forEach((i) => i.remove()), o.delete(n);
      }
      collectServerRenderedStyles() {
        let n = this.doc.head?.querySelectorAll(`style[${Na}="${this.appId}"]`);
        if (n?.length) {
          let o = new Map();
          return (
            n.forEach((i) => {
              i.textContent != null && o.set(i.textContent, i);
            }),
            o
          );
        }
        return null;
      }
      changeUsageCount(n, o) {
        let i = this.styleRef;
        if (i.has(n)) {
          let s = i.get(n);
          return (s.usage += o), s.usage;
        }
        return i.set(n, { usage: o, elements: [] }), o;
      }
      getStyleElement(n, o) {
        let i = this.styleNodesInDOM,
          s = i?.get(o);
        if (s?.parentNode === n) return i.delete(o), s.removeAttribute(Na), s;
        {
          let a = this.doc.createElement("style");
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = o),
            this.platformIsServer && a.setAttribute(Na, this.appId),
            n.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(n, o) {
        let i = this.getStyleElement(n, o),
          s = this.styleRef,
          a = s.get(o)?.elements;
        a ? a.push(i) : s.set(o, { elements: [i], usage: 1 });
      }
      resetHostNodes() {
        let n = this.hostNodes;
        n.clear(), n.add(this.doc.head);
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)(v(ne), v(Mo), v(Ks, 8), v(_t));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Oa = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/MathML/",
  },
  ja = /%COMP%/g,
  wf = "%COMP%",
  Qy = `_nghost-${wf}`,
  Jy = `_ngcontent-${wf}`,
  Ky = !0,
  Xy = new I("RemoveStylesOnCompDestroy", {
    providedIn: "root",
    factory: () => Ky,
  });
function eD(t) {
  return Jy.replace(ja, t);
}
function tD(t) {
  return Qy.replace(ja, t);
}
function Ef(t, e) {
  return e.map((r) => r.replace(ja, t));
}
var mf = (() => {
    let e = class e {
      constructor(n, o, i, s, a, c, u, l = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = o),
          (this.appId = i),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = c),
          (this.ngZone = u),
          (this.nonce = l),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = Aa(c)),
          (this.defaultRenderer = new Xn(n, a, u, this.platformIsServer));
      }
      createRenderer(n, o) {
        if (!n || !o) return this.defaultRenderer;
        this.platformIsServer &&
          o.encapsulation === Le.ShadowDom &&
          (o = H(g({}, o), { encapsulation: Le.Emulated }));
        let i = this.getOrCreateRenderer(n, o);
        return (
          i instanceof Xo
            ? i.applyToHost(n)
            : i instanceof er && i.applyStyles(),
          i
        );
      }
      getOrCreateRenderer(n, o) {
        let i = this.rendererByCompId,
          s = i.get(o.id);
        if (!s) {
          let a = this.doc,
            c = this.ngZone,
            u = this.eventManager,
            l = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            f = this.platformIsServer;
          switch (o.encapsulation) {
            case Le.Emulated:
              s = new Xo(u, l, o, this.appId, d, a, c, f);
              break;
            case Le.ShadowDom:
              return new La(u, l, n, o, a, c, this.nonce, f);
            default:
              s = new er(u, l, o, d, a, c, f);
              break;
          }
          i.set(o.id, s);
        }
        return s;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)(
        v(Df),
        v(Cf),
        v(Mo),
        v(Xy),
        v(ne),
        v(_t),
        v(L),
        v(Ks)
      );
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Xn = class {
    constructor(e, r, n, o) {
      (this.eventManager = e),
        (this.doc = r),
        (this.ngZone = n),
        (this.platformIsServer = o),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(e, r) {
      return r
        ? this.doc.createElementNS(Oa[r] || r, e)
        : this.doc.createElement(e);
    }
    createComment(e) {
      return this.doc.createComment(e);
    }
    createText(e) {
      return this.doc.createTextNode(e);
    }
    appendChild(e, r) {
      (vf(e) ? e.content : e).appendChild(r);
    }
    insertBefore(e, r, n) {
      e && (vf(e) ? e.content : e).insertBefore(r, n);
    }
    removeChild(e, r) {
      e && e.removeChild(r);
    }
    selectRootElement(e, r) {
      let n = typeof e == "string" ? this.doc.querySelector(e) : e;
      if (!n) throw new m(-5104, !1);
      return r || (n.textContent = ""), n;
    }
    parentNode(e) {
      return e.parentNode;
    }
    nextSibling(e) {
      return e.nextSibling;
    }
    setAttribute(e, r, n, o) {
      if (o) {
        r = o + ":" + r;
        let i = Oa[o];
        i ? e.setAttributeNS(i, r, n) : e.setAttribute(r, n);
      } else e.setAttribute(r, n);
    }
    removeAttribute(e, r, n) {
      if (n) {
        let o = Oa[n];
        o ? e.removeAttributeNS(o, r) : e.removeAttribute(`${n}:${r}`);
      } else e.removeAttribute(r);
    }
    addClass(e, r) {
      e.classList.add(r);
    }
    removeClass(e, r) {
      e.classList.remove(r);
    }
    setStyle(e, r, n, o) {
      o & (gt.DashCase | gt.Important)
        ? e.style.setProperty(r, n, o & gt.Important ? "important" : "")
        : (e.style[r] = n);
    }
    removeStyle(e, r, n) {
      n & gt.DashCase ? e.style.removeProperty(r) : (e.style[r] = "");
    }
    setProperty(e, r, n) {
      e != null && (e[r] = n);
    }
    setValue(e, r) {
      e.nodeValue = r;
    }
    listen(e, r, n) {
      if (
        typeof e == "string" &&
        ((e = Rt().getGlobalEventTarget(this.doc, e)), !e)
      )
        throw new Error(`Unsupported event target ${e} for event ${r}`);
      return this.eventManager.addEventListener(
        e,
        r,
        this.decoratePreventDefault(n)
      );
    }
    decoratePreventDefault(e) {
      return (r) => {
        if (r === "__ngUnwrap__") return e;
        (this.platformIsServer ? this.ngZone.runGuarded(() => e(r)) : e(r)) ===
          !1 && r.preventDefault();
      };
    }
  };
function vf(t) {
  return t.tagName === "TEMPLATE" && t.content !== void 0;
}
var La = class extends Xn {
    constructor(e, r, n, o, i, s, a, c) {
      super(e, i, s, c),
        (this.sharedStylesHost = r),
        (this.hostEl = n),
        (this.shadowRoot = n.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let u = Ef(o.id, o.styles);
      for (let l of u) {
        let d = document.createElement("style");
        a && d.setAttribute("nonce", a),
          (d.textContent = l),
          this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(e) {
      return e === this.hostEl ? this.shadowRoot : e;
    }
    appendChild(e, r) {
      return super.appendChild(this.nodeOrShadowRoot(e), r);
    }
    insertBefore(e, r, n) {
      return super.insertBefore(this.nodeOrShadowRoot(e), r, n);
    }
    removeChild(e, r) {
      return super.removeChild(this.nodeOrShadowRoot(e), r);
    }
    parentNode(e) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  er = class extends Xn {
    constructor(e, r, n, o, i, s, a, c) {
      super(e, i, s, a),
        (this.sharedStylesHost = r),
        (this.removeStylesOnCompDestroy = o),
        (this.styles = c ? Ef(c, n.styles) : n.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  Xo = class extends er {
    constructor(e, r, n, o, i, s, a, c) {
      let u = o + "-" + n.id;
      super(e, r, n, i, s, a, c, u),
        (this.contentAttr = eD(u)),
        (this.hostAttr = tD(u));
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, "");
    }
    createElement(e, r) {
      let n = super.createElement(e, r);
      return super.setAttribute(n, this.contentAttr, ""), n;
    }
  },
  nD = (() => {
    let e = class e extends Ko {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, o, i) {
        return (
          n.addEventListener(o, i, !1), () => this.removeEventListener(n, o, i)
        );
      }
      removeEventListener(n, o, i) {
        return n.removeEventListener(o, i);
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)(v(ne));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  yf = ["alt", "control", "meta", "shift"],
  rD = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  oD = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  iD = (() => {
    let e = class e extends Ko {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return e.parseEventName(n) != null;
      }
      addEventListener(n, o, i) {
        let s = e.parseEventName(o),
          a = e.eventCallback(s.fullKey, i, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => Rt().onAndCancel(n, s.domEventName, a));
      }
      static parseEventName(n) {
        let o = n.toLowerCase().split("."),
          i = o.shift();
        if (o.length === 0 || !(i === "keydown" || i === "keyup")) return null;
        let s = e._normalizeKey(o.pop()),
          a = "",
          c = o.indexOf("code");
        if (
          (c > -1 && (o.splice(c, 1), (a = "code.")),
          yf.forEach((l) => {
            let d = o.indexOf(l);
            d > -1 && (o.splice(d, 1), (a += l + "."));
          }),
          (a += s),
          o.length != 0 || s.length === 0)
        )
          return null;
        let u = {};
        return (u.domEventName = i), (u.fullKey = a), u;
      }
      static matchEventFullKeyCode(n, o) {
        let i = rD[n.key] || n.key,
          s = "";
        return (
          o.indexOf("code.") > -1 && ((i = n.code), (s = "code.")),
          i == null || !i
            ? !1
            : ((i = i.toLowerCase()),
              i === " " ? (i = "space") : i === "." && (i = "dot"),
              yf.forEach((a) => {
                if (a !== i) {
                  let c = oD[a];
                  c(n) && (s += a + ".");
                }
              }),
              (s += i),
              s === o)
        );
      }
      static eventCallback(n, o, i) {
        return (s) => {
          e.matchEventFullKeyCode(s, n) && i.runGuarded(() => o(s));
        };
      }
      static _normalizeKey(n) {
        return n === "esc" ? "escape" : n;
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)(v(ne));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function sD() {
  Pa.makeCurrent();
}
function aD() {
  return new Ue();
}
function cD() {
  return ed(document), document;
}
var uD = [
    { provide: _t, useValue: pf },
    { provide: Js, useValue: sD, multi: !0 },
    { provide: ne, useFactory: cD, deps: [] },
  ],
  If = Ca(Kd, "browser", uD),
  lD = new I(""),
  dD = [
    { provide: Qn, useClass: Fa, deps: [] },
    { provide: ma, useClass: $o, deps: [L, zo, Qn] },
    { provide: $o, useClass: $o, deps: [L, zo, Qn] },
  ],
  fD = [
    { provide: bo, useValue: "root" },
    { provide: Ue, useFactory: aD, deps: [] },
    { provide: ka, useClass: nD, multi: !0, deps: [ne, L, _t] },
    { provide: ka, useClass: iD, multi: !0, deps: [ne] },
    mf,
    Cf,
    Df,
    { provide: Un, useExisting: mf },
    { provide: qo, useClass: Yy, deps: [] },
    [],
  ],
  bf = (() => {
    let e = class e {
      constructor(n) {}
      static withServerTransition(n) {
        return { ngModule: e, providers: [{ provide: Mo, useValue: n.appId }] };
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)(v(lD, 12));
    }),
      (e.ɵmod = xe({ type: e })),
      (e.ɵinj = Se({ providers: [...fD, ...dD], imports: [hf, Xd] }));
    let t = e;
    return t;
  })();
function hD() {
  return new Va(v(ne));
}
var Va = (() => {
  let e = class e {
    constructor(n) {
      this._doc = n;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(n) {
      this._doc.title = n || "";
    }
  };
  (e.ɵfac = function (o) {
    return new (o || e)(v(ne));
  }),
    (e.ɵprov = y({
      token: e,
      factory: function (o) {
        let i = null;
        return o ? (i = new o()) : (i = hD()), i;
      },
      providedIn: "root",
    }));
  let t = e;
  return t;
})();
var b = "primary",
  gr = Symbol("RouteTitle"),
  za = class {
    constructor(e) {
      this.params = e || {};
    }
    has(e) {
      return Object.prototype.hasOwnProperty.call(this.params, e);
    }
    get(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r[0] : r;
      }
      return null;
    }
    getAll(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r : [r];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function Cn(t) {
  return new za(t);
}
function pD(t, e, r) {
  let n = r.path.split("/");
  if (
    n.length > t.length ||
    (r.pathMatch === "full" && (e.hasChildren() || n.length < t.length))
  )
    return null;
  let o = {};
  for (let i = 0; i < n.length; i++) {
    let s = n[i],
      a = t[i];
    if (s.startsWith(":")) o[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: t.slice(0, n.length), posParams: o };
}
function gD(t, e) {
  if (t.length !== e.length) return !1;
  for (let r = 0; r < t.length; ++r) if (!He(t[r], e[r])) return !1;
  return !0;
}
function He(t, e) {
  let r = t ? Ga(t) : void 0,
    n = e ? Ga(e) : void 0;
  if (!r || !n || r.length != n.length) return !1;
  let o;
  for (let i = 0; i < r.length; i++)
    if (((o = r[i]), !Pf(t[o], e[o]))) return !1;
  return !0;
}
function Ga(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function Pf(t, e) {
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1;
    let r = [...t].sort(),
      n = [...e].sort();
    return r.every((o, i) => n[i] === o);
  } else return t === e;
}
function Ff(t) {
  return t.length > 0 ? t[t.length - 1] : null;
}
function Dt(t) {
  return Oi(t) ? t : Yn(t) ? B(Promise.resolve(t)) : C(t);
}
var mD = { exact: Lf, subset: jf },
  kf = { exact: vD, subset: yD, ignored: () => !0 };
function Sf(t, e, r) {
  return (
    mD[r.paths](t.root, e.root, r.matrixParams) &&
    kf[r.queryParams](t.queryParams, e.queryParams) &&
    !(r.fragment === "exact" && t.fragment !== e.fragment)
  );
}
function vD(t, e) {
  return He(t, e);
}
function Lf(t, e, r) {
  if (
    !Ft(t.segments, e.segments) ||
    !ni(t.segments, e.segments, r) ||
    t.numberOfChildren !== e.numberOfChildren
  )
    return !1;
  for (let n in e.children)
    if (!t.children[n] || !Lf(t.children[n], e.children[n], r)) return !1;
  return !0;
}
function yD(t, e) {
  return (
    Object.keys(e).length <= Object.keys(t).length &&
    Object.keys(e).every((r) => Pf(t[r], e[r]))
  );
}
function jf(t, e, r) {
  return Vf(t, e, e.segments, r);
}
function Vf(t, e, r, n) {
  if (t.segments.length > r.length) {
    let o = t.segments.slice(0, r.length);
    return !(!Ft(o, r) || e.hasChildren() || !ni(o, r, n));
  } else if (t.segments.length === r.length) {
    if (!Ft(t.segments, r) || !ni(t.segments, r, n)) return !1;
    for (let o in e.children)
      if (!t.children[o] || !jf(t.children[o], e.children[o], n)) return !1;
    return !0;
  } else {
    let o = r.slice(0, t.segments.length),
      i = r.slice(t.segments.length);
    return !Ft(t.segments, o) || !ni(t.segments, o, n) || !t.children[b]
      ? !1
      : Vf(t.children[b], e, i, n);
  }
}
function ni(t, e, r) {
  return e.every((n, o) => kf[r](t[o].parameters, n.parameters));
}
var mt = class {
    constructor(e = new N([], {}), r = {}, n = null) {
      (this.root = e), (this.queryParams = r), (this.fragment = n);
    }
    get queryParamMap() {
      return (
        this._queryParamMap || (this._queryParamMap = Cn(this.queryParams)),
        this._queryParamMap
      );
    }
    toString() {
      return wD.serialize(this);
    }
  },
  N = class {
    constructor(e, r) {
      (this.segments = e),
        (this.children = r),
        (this.parent = null),
        Object.values(r).forEach((n) => (n.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return ri(this);
    }
  },
  Pt = class {
    constructor(e, r) {
      (this.path = e), (this.parameters = r);
    }
    get parameterMap() {
      return (
        this._parameterMap || (this._parameterMap = Cn(this.parameters)),
        this._parameterMap
      );
    }
    toString() {
      return Bf(this);
    }
  };
function DD(t, e) {
  return Ft(t, e) && t.every((r, n) => He(r.parameters, e[n].parameters));
}
function Ft(t, e) {
  return t.length !== e.length ? !1 : t.every((r, n) => r.path === e[n].path);
}
function CD(t, e) {
  let r = [];
  return (
    Object.entries(t.children).forEach(([n, o]) => {
      n === b && (r = r.concat(e(o, n)));
    }),
    Object.entries(t.children).forEach(([n, o]) => {
      n !== b && (r = r.concat(e(o, n)));
    }),
    r
  );
}
var mr = (() => {
    let e = class e {};
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵprov = y({
        token: e,
        factory: () => (() => new ar())(),
        providedIn: "root",
      }));
    let t = e;
    return t;
  })(),
  ar = class {
    parse(e) {
      let r = new qa(e);
      return new mt(
        r.parseRootSegment(),
        r.parseQueryParams(),
        r.parseFragment()
      );
    }
    serialize(e) {
      let r = `/${tr(e.root, !0)}`,
        n = bD(e.queryParams),
        o = typeof e.fragment == "string" ? `#${ED(e.fragment)}` : "";
      return `${r}${n}${o}`;
    }
  },
  wD = new ar();
function ri(t) {
  return t.segments.map((e) => Bf(e)).join("/");
}
function tr(t, e) {
  if (!t.hasChildren()) return ri(t);
  if (e) {
    let r = t.children[b] ? tr(t.children[b], !1) : "",
      n = [];
    return (
      Object.entries(t.children).forEach(([o, i]) => {
        o !== b && n.push(`${o}:${tr(i, !1)}`);
      }),
      n.length > 0 ? `${r}(${n.join("//")})` : r
    );
  } else {
    let r = CD(t, (n, o) =>
      o === b ? [tr(t.children[b], !1)] : [`${o}:${tr(n, !1)}`]
    );
    return Object.keys(t.children).length === 1 && t.children[b] != null
      ? `${ri(t)}/${r[0]}`
      : `${ri(t)}/(${r.join("//")})`;
  }
}
function Uf(t) {
  return encodeURIComponent(t)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function ei(t) {
  return Uf(t).replace(/%3B/gi, ";");
}
function ED(t) {
  return encodeURI(t);
}
function Wa(t) {
  return Uf(t)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function oi(t) {
  return decodeURIComponent(t);
}
function xf(t) {
  return oi(t.replace(/\+/g, "%20"));
}
function Bf(t) {
  return `${Wa(t.path)}${ID(t.parameters)}`;
}
function ID(t) {
  return Object.keys(t)
    .map((e) => `;${Wa(e)}=${Wa(t[e])}`)
    .join("");
}
function bD(t) {
  let e = Object.keys(t)
    .map((r) => {
      let n = t[r];
      return Array.isArray(n)
        ? n.map((o) => `${ei(r)}=${ei(o)}`).join("&")
        : `${ei(r)}=${ei(n)}`;
    })
    .filter((r) => !!r);
  return e.length ? `?${e.join("&")}` : "";
}
var MD = /^[^\/()?;#]+/;
function Ua(t) {
  let e = t.match(MD);
  return e ? e[0] : "";
}
var SD = /^[^\/()?;=#]+/;
function xD(t) {
  let e = t.match(SD);
  return e ? e[0] : "";
}
var TD = /^[^=?&#]+/;
function AD(t) {
  let e = t.match(TD);
  return e ? e[0] : "";
}
var _D = /^[^&#]+/;
function ND(t) {
  let e = t.match(_D);
  return e ? e[0] : "";
}
var qa = class {
  constructor(e) {
    (this.url = e), (this.remaining = e);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new N([], {})
        : new N([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let e = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(e);
      while (this.consumeOptional("&"));
    return e;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let e = [];
    for (
      this.peekStartsWith("(") || e.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), e.push(this.parseSegment());
    let r = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (r = this.parseParens(!0)));
    let n = {};
    return (
      this.peekStartsWith("(") && (n = this.parseParens(!1)),
      (e.length > 0 || Object.keys(r).length > 0) && (n[b] = new N(e, r)),
      n
    );
  }
  parseSegment() {
    let e = Ua(this.remaining);
    if (e === "" && this.peekStartsWith(";")) throw new m(4009, !1);
    return this.capture(e), new Pt(oi(e), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let e = {};
    for (; this.consumeOptional(";"); ) this.parseParam(e);
    return e;
  }
  parseParam(e) {
    let r = xD(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let o = Ua(this.remaining);
      o && ((n = o), this.capture(n));
    }
    e[oi(r)] = oi(n);
  }
  parseQueryParam(e) {
    let r = AD(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let s = ND(this.remaining);
      s && ((n = s), this.capture(n));
    }
    let o = xf(r),
      i = xf(n);
    if (e.hasOwnProperty(o)) {
      let s = e[o];
      Array.isArray(s) || ((s = [s]), (e[o] = s)), s.push(i);
    } else e[o] = i;
  }
  parseParens(e) {
    let r = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let n = Ua(this.remaining),
        o = this.remaining[n.length];
      if (o !== "/" && o !== ")" && o !== ";") throw new m(4010, !1);
      let i;
      n.indexOf(":") > -1
        ? ((i = n.slice(0, n.indexOf(":"))), this.capture(i), this.capture(":"))
        : e && (i = b);
      let s = this.parseChildren();
      (r[i] = Object.keys(s).length === 1 ? s[b] : new N([], s)),
        this.consumeOptional("//");
    }
    return r;
  }
  peekStartsWith(e) {
    return this.remaining.startsWith(e);
  }
  consumeOptional(e) {
    return this.peekStartsWith(e)
      ? ((this.remaining = this.remaining.substring(e.length)), !0)
      : !1;
  }
  capture(e) {
    if (!this.consumeOptional(e)) throw new m(4011, !1);
  }
};
function Hf(t) {
  return t.segments.length > 0 ? new N([], { [b]: t }) : t;
}
function $f(t) {
  let e = {};
  for (let n of Object.keys(t.children)) {
    let o = t.children[n],
      i = $f(o);
    if (n === b && i.segments.length === 0 && i.hasChildren())
      for (let [s, a] of Object.entries(i.children)) e[s] = a;
    else (i.segments.length > 0 || i.hasChildren()) && (e[n] = i);
  }
  let r = new N(t.segments, e);
  return OD(r);
}
function OD(t) {
  if (t.numberOfChildren === 1 && t.children[b]) {
    let e = t.children[b];
    return new N(t.segments.concat(e.segments), e.children);
  }
  return t;
}
function wn(t) {
  return t instanceof mt;
}
function RD(t, e, r = null, n = null) {
  let o = zf(t);
  return Gf(o, e, r, n);
}
function zf(t) {
  let e;
  function r(i) {
    let s = {};
    for (let c of i.children) {
      let u = r(c);
      s[c.outlet] = u;
    }
    let a = new N(i.url, s);
    return i === t && (e = a), a;
  }
  let n = r(t.root),
    o = Hf(n);
  return e ?? o;
}
function Gf(t, e, r, n) {
  let o = t;
  for (; o.parent; ) o = o.parent;
  if (e.length === 0) return Ba(o, o, o, r, n);
  let i = PD(e);
  if (i.toRoot()) return Ba(o, o, new N([], {}), r, n);
  let s = FD(i, o, t),
    a = s.processChildren
      ? or(s.segmentGroup, s.index, i.commands)
      : qf(s.segmentGroup, s.index, i.commands);
  return Ba(o, s.segmentGroup, a, r, n);
}
function ii(t) {
  return typeof t == "object" && t != null && !t.outlets && !t.segmentPath;
}
function cr(t) {
  return typeof t == "object" && t != null && t.outlets;
}
function Ba(t, e, r, n, o) {
  let i = {};
  n &&
    Object.entries(n).forEach(([c, u]) => {
      i[c] = Array.isArray(u) ? u.map((l) => `${l}`) : `${u}`;
    });
  let s;
  t === e ? (s = r) : (s = Wf(t, e, r));
  let a = Hf($f(s));
  return new mt(a, i, o);
}
function Wf(t, e, r) {
  let n = {};
  return (
    Object.entries(t.children).forEach(([o, i]) => {
      i === e ? (n[o] = r) : (n[o] = Wf(i, e, r));
    }),
    new N(t.segments, n)
  );
}
var si = class {
  constructor(e, r, n) {
    if (
      ((this.isAbsolute = e),
      (this.numberOfDoubleDots = r),
      (this.commands = n),
      e && n.length > 0 && ii(n[0]))
    )
      throw new m(4003, !1);
    let o = n.find(cr);
    if (o && o !== Ff(n)) throw new m(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function PD(t) {
  if (typeof t[0] == "string" && t.length === 1 && t[0] === "/")
    return new si(!0, 0, t);
  let e = 0,
    r = !1,
    n = t.reduce((o, i, s) => {
      if (typeof i == "object" && i != null) {
        if (i.outlets) {
          let a = {};
          return (
            Object.entries(i.outlets).forEach(([c, u]) => {
              a[c] = typeof u == "string" ? u.split("/") : u;
            }),
            [...o, { outlets: a }]
          );
        }
        if (i.segmentPath) return [...o, i.segmentPath];
      }
      return typeof i != "string"
        ? [...o, i]
        : s === 0
        ? (i.split("/").forEach((a, c) => {
            (c == 0 && a === ".") ||
              (c == 0 && a === ""
                ? (r = !0)
                : a === ".."
                ? e++
                : a != "" && o.push(a));
          }),
          o)
        : [...o, i];
    }, []);
  return new si(r, e, n);
}
var yn = class {
  constructor(e, r, n) {
    (this.segmentGroup = e), (this.processChildren = r), (this.index = n);
  }
};
function FD(t, e, r) {
  if (t.isAbsolute) return new yn(e, !0, 0);
  if (!r) return new yn(e, !1, NaN);
  if (r.parent === null) return new yn(r, !0, 0);
  let n = ii(t.commands[0]) ? 0 : 1,
    o = r.segments.length - 1 + n;
  return kD(r, o, t.numberOfDoubleDots);
}
function kD(t, e, r) {
  let n = t,
    o = e,
    i = r;
  for (; i > o; ) {
    if (((i -= o), (n = n.parent), !n)) throw new m(4005, !1);
    o = n.segments.length;
  }
  return new yn(n, !1, o - i);
}
function LD(t) {
  return cr(t[0]) ? t[0].outlets : { [b]: t };
}
function qf(t, e, r) {
  if ((t || (t = new N([], {})), t.segments.length === 0 && t.hasChildren()))
    return or(t, e, r);
  let n = jD(t, e, r),
    o = r.slice(n.commandIndex);
  if (n.match && n.pathIndex < t.segments.length) {
    let i = new N(t.segments.slice(0, n.pathIndex), {});
    return (
      (i.children[b] = new N(t.segments.slice(n.pathIndex), t.children)),
      or(i, 0, o)
    );
  } else
    return n.match && o.length === 0
      ? new N(t.segments, {})
      : n.match && !t.hasChildren()
      ? Za(t, e, r)
      : n.match
      ? or(t, 0, o)
      : Za(t, e, r);
}
function or(t, e, r) {
  if (r.length === 0) return new N(t.segments, {});
  {
    let n = LD(r),
      o = {};
    if (
      Object.keys(n).some((i) => i !== b) &&
      t.children[b] &&
      t.numberOfChildren === 1 &&
      t.children[b].segments.length === 0
    ) {
      let i = or(t.children[b], e, r);
      return new N(t.segments, i.children);
    }
    return (
      Object.entries(n).forEach(([i, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (o[i] = qf(t.children[i], e, s));
      }),
      Object.entries(t.children).forEach(([i, s]) => {
        n[i] === void 0 && (o[i] = s);
      }),
      new N(t.segments, o)
    );
  }
}
function jD(t, e, r) {
  let n = 0,
    o = e,
    i = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; o < t.segments.length; ) {
    if (n >= r.length) return i;
    let s = t.segments[o],
      a = r[n];
    if (cr(a)) break;
    let c = `${a}`,
      u = n < r.length - 1 ? r[n + 1] : null;
    if (o > 0 && c === void 0) break;
    if (c && u && typeof u == "object" && u.outlets === void 0) {
      if (!Af(c, u, s)) return i;
      n += 2;
    } else {
      if (!Af(c, {}, s)) return i;
      n++;
    }
    o++;
  }
  return { match: !0, pathIndex: o, commandIndex: n };
}
function Za(t, e, r) {
  let n = t.segments.slice(0, e),
    o = 0;
  for (; o < r.length; ) {
    let i = r[o];
    if (cr(i)) {
      let c = VD(i.outlets);
      return new N(n, c);
    }
    if (o === 0 && ii(r[0])) {
      let c = t.segments[e];
      n.push(new Pt(c.path, Tf(r[0]))), o++;
      continue;
    }
    let s = cr(i) ? i.outlets[b] : `${i}`,
      a = o < r.length - 1 ? r[o + 1] : null;
    s && a && ii(a)
      ? (n.push(new Pt(s, Tf(a))), (o += 2))
      : (n.push(new Pt(s, {})), o++);
  }
  return new N(n, {});
}
function VD(t) {
  let e = {};
  return (
    Object.entries(t).forEach(([r, n]) => {
      typeof n == "string" && (n = [n]),
        n !== null && (e[r] = Za(new N([], {}), 0, n));
    }),
    e
  );
}
function Tf(t) {
  let e = {};
  return Object.entries(t).forEach(([r, n]) => (e[r] = `${n}`)), e;
}
function Af(t, e, r) {
  return t == r.path && He(e, r.parameters);
}
var ir = "imperative",
  De = class {
    constructor(e, r) {
      (this.id = e), (this.url = r);
    }
  },
  En = class extends De {
    constructor(e, r, n = "imperative", o = null) {
      super(e, r),
        (this.type = 0),
        (this.navigationTrigger = n),
        (this.restoredState = o);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  $e = class extends De {
    constructor(e, r, n) {
      super(e, r), (this.urlAfterRedirects = n), (this.type = 1);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  vt = class extends De {
    constructor(e, r, n, o) {
      super(e, r), (this.reason = n), (this.code = o), (this.type = 2);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  yt = class extends De {
    constructor(e, r, n, o) {
      super(e, r), (this.reason = n), (this.code = o), (this.type = 16);
    }
  },
  ur = class extends De {
    constructor(e, r, n, o) {
      super(e, r), (this.error = n), (this.target = o), (this.type = 3);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  ai = class extends De {
    constructor(e, r, n, o) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = o),
        (this.type = 4);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Ya = class extends De {
    constructor(e, r, n, o) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = o),
        (this.type = 7);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Qa = class extends De {
    constructor(e, r, n, o, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = o),
        (this.shouldActivate = i),
        (this.type = 8);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  Ja = class extends De {
    constructor(e, r, n, o) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = o),
        (this.type = 5);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Ka = class extends De {
    constructor(e, r, n, o) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = o),
        (this.type = 6);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Xa = class {
    constructor(e) {
      (this.route = e), (this.type = 9);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  ec = class {
    constructor(e) {
      (this.route = e), (this.type = 10);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  tc = class {
    constructor(e) {
      (this.snapshot = e), (this.type = 11);
    }
    toString() {
      return `ChildActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  nc = class {
    constructor(e) {
      (this.snapshot = e), (this.type = 12);
    }
    toString() {
      return `ChildActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  rc = class {
    constructor(e) {
      (this.snapshot = e), (this.type = 13);
    }
    toString() {
      return `ActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  oc = class {
    constructor(e) {
      (this.snapshot = e), (this.type = 14);
    }
    toString() {
      return `ActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  ci = class {
    constructor(e, r, n) {
      (this.routerEvent = e),
        (this.position = r),
        (this.anchor = n),
        (this.type = 15);
    }
    toString() {
      let e = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
      return `Scroll(anchor: '${this.anchor}', position: '${e}')`;
    }
  },
  lr = class {},
  dr = class {
    constructor(e) {
      this.url = e;
    }
  };
var ic = class {
    constructor() {
      (this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new vr()),
        (this.attachRef = null);
    }
  },
  vr = (() => {
    let e = class e {
      constructor() {
        this.contexts = new Map();
      }
      onChildOutletCreated(n, o) {
        let i = this.getOrCreateContext(n);
        (i.outlet = o), this.contexts.set(n, i);
      }
      onChildOutletDestroyed(n) {
        let o = this.getContext(n);
        o && ((o.outlet = null), (o.attachRef = null));
      }
      onOutletDeactivated() {
        let n = this.contexts;
        return (this.contexts = new Map()), n;
      }
      onOutletReAttached(n) {
        this.contexts = n;
      }
      getOrCreateContext(n) {
        let o = this.getContext(n);
        return o || ((o = new ic()), this.contexts.set(n, o)), o;
      }
      getContext(n) {
        return this.contexts.get(n) || null;
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  ui = class {
    constructor(e) {
      this._root = e;
    }
    get root() {
      return this._root.value;
    }
    parent(e) {
      let r = this.pathFromRoot(e);
      return r.length > 1 ? r[r.length - 2] : null;
    }
    children(e) {
      let r = sc(e, this._root);
      return r ? r.children.map((n) => n.value) : [];
    }
    firstChild(e) {
      let r = sc(e, this._root);
      return r && r.children.length > 0 ? r.children[0].value : null;
    }
    siblings(e) {
      let r = ac(e, this._root);
      return r.length < 2
        ? []
        : r[r.length - 2].children.map((o) => o.value).filter((o) => o !== e);
    }
    pathFromRoot(e) {
      return ac(e, this._root).map((r) => r.value);
    }
  };
function sc(t, e) {
  if (t === e.value) return e;
  for (let r of e.children) {
    let n = sc(t, r);
    if (n) return n;
  }
  return null;
}
function ac(t, e) {
  if (t === e.value) return [e];
  for (let r of e.children) {
    let n = ac(t, r);
    if (n.length) return n.unshift(e), n;
  }
  return [];
}
var le = class {
  constructor(e, r) {
    (this.value = e), (this.children = r);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function vn(t) {
  let e = {};
  return t && t.children.forEach((r) => (e[r.value.outlet] = r)), e;
}
var li = class extends ui {
  constructor(e, r) {
    super(e), (this.snapshot = r), vc(this, e);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function Zf(t, e) {
  let r = UD(t, e),
    n = new Q([new Pt("", {})]),
    o = new Q({}),
    i = new Q({}),
    s = new Q({}),
    a = new Q(""),
    c = new kt(n, o, s, a, i, b, e, r.root);
  return (c.snapshot = r.root), new li(new le(c, []), r);
}
function UD(t, e) {
  let r = {},
    n = {},
    o = {},
    i = "",
    s = new fr([], r, o, i, n, b, e, null, {});
  return new di("", new le(s, []));
}
var kt = class {
  constructor(e, r, n, o, i, s, a, c) {
    (this.urlSubject = e),
      (this.paramsSubject = r),
      (this.queryParamsSubject = n),
      (this.fragmentSubject = o),
      (this.dataSubject = i),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(A((u) => u[gr])) ?? C(void 0)),
      (this.url = e),
      (this.params = r),
      (this.queryParams = n),
      (this.fragment = o),
      (this.data = i);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      this._paramMap || (this._paramMap = this.params.pipe(A((e) => Cn(e)))),
      this._paramMap
    );
  }
  get queryParamMap() {
    return (
      this._queryParamMap ||
        (this._queryParamMap = this.queryParams.pipe(A((e) => Cn(e)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function mc(t, e, r = "emptyOnly") {
  let n,
    { routeConfig: o } = t;
  return (
    e !== null &&
    (r === "always" ||
      o?.path === "" ||
      (!e.component && !e.routeConfig?.loadComponent))
      ? (n = {
          params: g(g({}, e.params), t.params),
          data: g(g({}, e.data), t.data),
          resolve: g(g(g(g({}, t.data), e.data), o?.data), t._resolvedData),
        })
      : (n = {
          params: g({}, t.params),
          data: g({}, t.data),
          resolve: g(g({}, t.data), t._resolvedData ?? {}),
        }),
    o && Qf(o) && (n.resolve[gr] = o.title),
    n
  );
}
var fr = class {
    get title() {
      return this.data?.[gr];
    }
    constructor(e, r, n, o, i, s, a, c, u) {
      (this.url = e),
        (this.params = r),
        (this.queryParams = n),
        (this.fragment = o),
        (this.data = i),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = c),
        (this._resolve = u);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (
        this._paramMap || (this._paramMap = Cn(this.params)), this._paramMap
      );
    }
    get queryParamMap() {
      return (
        this._queryParamMap || (this._queryParamMap = Cn(this.queryParams)),
        this._queryParamMap
      );
    }
    toString() {
      let e = this.url.map((n) => n.toString()).join("/"),
        r = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${e}', path:'${r}')`;
    }
  },
  di = class extends ui {
    constructor(e, r) {
      super(r), (this.url = e), vc(this, r);
    }
    toString() {
      return Yf(this._root);
    }
  };
function vc(t, e) {
  (e.value._routerState = t), e.children.forEach((r) => vc(t, r));
}
function Yf(t) {
  let e = t.children.length > 0 ? ` { ${t.children.map(Yf).join(", ")} } ` : "";
  return `${t.value}${e}`;
}
function Ha(t) {
  if (t.snapshot) {
    let e = t.snapshot,
      r = t._futureSnapshot;
    (t.snapshot = r),
      He(e.queryParams, r.queryParams) ||
        t.queryParamsSubject.next(r.queryParams),
      e.fragment !== r.fragment && t.fragmentSubject.next(r.fragment),
      He(e.params, r.params) || t.paramsSubject.next(r.params),
      gD(e.url, r.url) || t.urlSubject.next(r.url),
      He(e.data, r.data) || t.dataSubject.next(r.data);
  } else
    (t.snapshot = t._futureSnapshot),
      t.dataSubject.next(t._futureSnapshot.data);
}
function cc(t, e) {
  let r = He(t.params, e.params) && DD(t.url, e.url),
    n = !t.parent != !e.parent;
  return r && !n && (!t.parent || cc(t.parent, e.parent));
}
function Qf(t) {
  return typeof t.title == "string" || t.title === null;
}
var yc = (() => {
    let e = class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = b),
          (this.activateEvents = new X()),
          (this.deactivateEvents = new X()),
          (this.attachEvents = new X()),
          (this.detachEvents = new X()),
          (this.parentContexts = p(vr)),
          (this.location = p(dn)),
          (this.changeDetector = p(Fo)),
          (this.environmentInjector = p(ue)),
          (this.inputBinder = p(mi, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: o, previousValue: i } = n.name;
          if (o) return;
          this.isTrackedInParentContexts(i) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(i)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(n) {
        return this.parentContexts.getContext(n)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let n = this.parentContexts.getContext(this.name);
        n?.route &&
          (n.attachRef
            ? this.attach(n.attachRef, n.route)
            : this.activateWith(n.route, n.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new m(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new m(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new m(4012, !1);
        this.location.detach();
        let n = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(n.instance),
          n
        );
      }
      attach(n, o) {
        (this.activated = n),
          (this._activatedRoute = o),
          this.location.insert(n.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(n.instance);
      }
      deactivate() {
        if (this.activated) {
          let n = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(n);
        }
      }
      activateWith(n, o) {
        if (this.isActivated) throw new m(4013, !1);
        this._activatedRoute = n;
        let i = this.location,
          a = n.snapshot.component,
          c = this.parentContexts.getOrCreateContext(this.name).children,
          u = new uc(n, c, i.injector);
        (this.activated = i.createComponent(a, {
          index: i.length,
          injector: u,
          environmentInjector: o ?? this.environmentInjector,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵdir = dt({
        type: e,
        selectors: [["router-outlet"]],
        inputs: { name: "name" },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        standalone: !0,
        features: [zn],
      }));
    let t = e;
    return t;
  })(),
  uc = class {
    constructor(e, r, n) {
      (this.route = e), (this.childContexts = r), (this.parent = n);
    }
    get(e, r) {
      return e === kt
        ? this.route
        : e === vr
        ? this.childContexts
        : this.parent.get(e, r);
    }
  },
  mi = new I(""),
  _f = (() => {
    let e = class e {
      constructor() {
        this.outletDataSubscriptions = new Map();
      }
      bindActivatedRouteToOutletComponent(n) {
        this.unsubscribeFromRouteData(n), this.subscribeToRouteData(n);
      }
      unsubscribeFromRouteData(n) {
        this.outletDataSubscriptions.get(n)?.unsubscribe(),
          this.outletDataSubscriptions.delete(n);
      }
      subscribeToRouteData(n) {
        let { activatedRoute: o } = n,
          i = xn([o.queryParams, o.params, o.data])
            .pipe(
              he(
                ([s, a, c], u) => (
                  (c = g(g(g({}, s), a), c)),
                  u === 0 ? C(c) : Promise.resolve(c)
                )
              )
            )
            .subscribe((s) => {
              if (
                !n.isActivated ||
                !n.activatedComponentRef ||
                n.activatedRoute !== o ||
                o.component === null
              ) {
                this.unsubscribeFromRouteData(n);
                return;
              }
              let a = ef(o.component);
              if (!a) {
                this.unsubscribeFromRouteData(n);
                return;
              }
              for (let { templateName: c } of a.inputs)
                n.activatedComponentRef.setInput(c, s[c]);
            });
        this.outletDataSubscriptions.set(n, i);
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function BD(t, e, r) {
  let n = hr(t, e._root, r ? r._root : void 0);
  return new li(n, e);
}
function hr(t, e, r) {
  if (r && t.shouldReuseRoute(e.value, r.value.snapshot)) {
    let n = r.value;
    n._futureSnapshot = e.value;
    let o = HD(t, e, r);
    return new le(n, o);
  } else {
    if (t.shouldAttach(e.value)) {
      let i = t.retrieve(e.value);
      if (i !== null) {
        let s = i.route;
        return (
          (s.value._futureSnapshot = e.value),
          (s.children = e.children.map((a) => hr(t, a))),
          s
        );
      }
    }
    let n = $D(e.value),
      o = e.children.map((i) => hr(t, i));
    return new le(n, o);
  }
}
function HD(t, e, r) {
  return e.children.map((n) => {
    for (let o of r.children)
      if (t.shouldReuseRoute(n.value, o.value.snapshot)) return hr(t, n, o);
    return hr(t, n);
  });
}
function $D(t) {
  return new kt(
    new Q(t.url),
    new Q(t.params),
    new Q(t.queryParams),
    new Q(t.fragment),
    new Q(t.data),
    t.outlet,
    t.component,
    t
  );
}
var Jf = "ngNavigationCancelingError";
function Kf(t, e) {
  let { redirectTo: r, navigationBehaviorOptions: n } = wn(e)
      ? { redirectTo: e, navigationBehaviorOptions: void 0 }
      : e,
    o = Xf(!1, 0, e);
  return (o.url = r), (o.navigationBehaviorOptions = n), o;
}
function Xf(t, e, r) {
  let n = new Error("NavigationCancelingError: " + (t || ""));
  return (n[Jf] = !0), (n.cancellationCode = e), r && (n.url = r), n;
}
function zD(t) {
  return eh(t) && wn(t.url);
}
function eh(t) {
  return t && t[Jf];
}
var GD = (() => {
  let e = class e {};
  (e.ɵfac = function (o) {
    return new (o || e)();
  }),
    (e.ɵcmp = Be({
      type: e,
      selectors: [["ng-component"]],
      standalone: !0,
      features: [zd],
      decls: 1,
      vars: 0,
      template: function (o, i) {
        o & 1 && Je(0, "router-outlet");
      },
      dependencies: [yc],
      encapsulation: 2,
    }));
  let t = e;
  return t;
})();
function WD(t, e) {
  return (
    t.providers &&
      !t._injector &&
      (t._injector = ko(t.providers, e, `Route: ${t.path}`)),
    t._injector ?? e
  );
}
function Dc(t) {
  let e = t.children && t.children.map(Dc),
    r = e ? H(g({}, t), { children: e }) : g({}, t);
  return (
    !r.component &&
      !r.loadComponent &&
      (e || r.loadChildren) &&
      r.outlet &&
      r.outlet !== b &&
      (r.component = GD),
    r
  );
}
function ze(t) {
  return t.outlet || b;
}
function qD(t, e) {
  let r = t.filter((n) => ze(n) === e);
  return r.push(...t.filter((n) => ze(n) !== e)), r;
}
function yr(t) {
  if (!t) return null;
  if (t.routeConfig?._injector) return t.routeConfig._injector;
  for (let e = t.parent; e; e = e.parent) {
    let r = e.routeConfig;
    if (r?._loadedInjector) return r._loadedInjector;
    if (r?._injector) return r._injector;
  }
  return null;
}
var ZD = (t, e, r, n) =>
    A(
      (o) => (
        new lc(e, o.targetRouterState, o.currentRouterState, r, n).activate(t),
        o
      )
    ),
  lc = class {
    constructor(e, r, n, o, i) {
      (this.routeReuseStrategy = e),
        (this.futureState = r),
        (this.currState = n),
        (this.forwardEvent = o),
        (this.inputBindingEnabled = i);
    }
    activate(e) {
      let r = this.futureState._root,
        n = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(r, n, e),
        Ha(this.futureState.root),
        this.activateChildRoutes(r, n, e);
    }
    deactivateChildRoutes(e, r, n) {
      let o = vn(r);
      e.children.forEach((i) => {
        let s = i.value.outlet;
        this.deactivateRoutes(i, o[s], n), delete o[s];
      }),
        Object.values(o).forEach((i) => {
          this.deactivateRouteAndItsChildren(i, n);
        });
    }
    deactivateRoutes(e, r, n) {
      let o = e.value,
        i = r ? r.value : null;
      if (o === i)
        if (o.component) {
          let s = n.getContext(o.outlet);
          s && this.deactivateChildRoutes(e, r, s.children);
        } else this.deactivateChildRoutes(e, r, n);
      else i && this.deactivateRouteAndItsChildren(r, n);
    }
    deactivateRouteAndItsChildren(e, r) {
      e.value.component &&
      this.routeReuseStrategy.shouldDetach(e.value.snapshot)
        ? this.detachAndStoreRouteSubtree(e, r)
        : this.deactivateRouteAndOutlet(e, r);
    }
    detachAndStoreRouteSubtree(e, r) {
      let n = r.getContext(e.value.outlet),
        o = n && e.value.component ? n.children : r,
        i = vn(e);
      for (let s of Object.keys(i)) this.deactivateRouteAndItsChildren(i[s], o);
      if (n && n.outlet) {
        let s = n.outlet.detach(),
          a = n.children.onOutletDeactivated();
        this.routeReuseStrategy.store(e.value.snapshot, {
          componentRef: s,
          route: e,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(e, r) {
      let n = r.getContext(e.value.outlet),
        o = n && e.value.component ? n.children : r,
        i = vn(e);
      for (let s of Object.keys(i)) this.deactivateRouteAndItsChildren(i[s], o);
      n &&
        (n.outlet && (n.outlet.deactivate(), n.children.onOutletDeactivated()),
        (n.attachRef = null),
        (n.route = null));
    }
    activateChildRoutes(e, r, n) {
      let o = vn(r);
      e.children.forEach((i) => {
        this.activateRoutes(i, o[i.value.outlet], n),
          this.forwardEvent(new oc(i.value.snapshot));
      }),
        e.children.length && this.forwardEvent(new nc(e.value.snapshot));
    }
    activateRoutes(e, r, n) {
      let o = e.value,
        i = r ? r.value : null;
      if ((Ha(o), o === i))
        if (o.component) {
          let s = n.getOrCreateContext(o.outlet);
          this.activateChildRoutes(e, r, s.children);
        } else this.activateChildRoutes(e, r, n);
      else if (o.component) {
        let s = n.getOrCreateContext(o.outlet);
        if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(o.snapshot);
          this.routeReuseStrategy.store(o.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            Ha(a.route.value),
            this.activateChildRoutes(e, null, s.children);
        } else {
          let a = yr(o.snapshot);
          (s.attachRef = null),
            (s.route = o),
            (s.injector = a),
            s.outlet && s.outlet.activateWith(o, s.injector),
            this.activateChildRoutes(e, null, s.children);
        }
      } else this.activateChildRoutes(e, null, n);
    }
  },
  fi = class {
    constructor(e) {
      (this.path = e), (this.route = this.path[this.path.length - 1]);
    }
  },
  Dn = class {
    constructor(e, r) {
      (this.component = e), (this.route = r);
    }
  };
function YD(t, e, r) {
  let n = t._root,
    o = e ? e._root : null;
  return nr(n, o, r, [n.value]);
}
function QD(t) {
  let e = t.routeConfig ? t.routeConfig.canActivateChild : null;
  return !e || e.length === 0 ? null : { node: t, guards: e };
}
function bn(t, e) {
  let r = Symbol(),
    n = e.get(t, r);
  return n === r ? (typeof t == "function" && !Qu(t) ? t : e.get(t)) : n;
}
function nr(
  t,
  e,
  r,
  n,
  o = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let i = vn(e);
  return (
    t.children.forEach((s) => {
      JD(s, i[s.value.outlet], r, n.concat([s.value]), o),
        delete i[s.value.outlet];
    }),
    Object.entries(i).forEach(([s, a]) => sr(a, r.getContext(s), o)),
    o
  );
}
function JD(
  t,
  e,
  r,
  n,
  o = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let i = t.value,
    s = e ? e.value : null,
    a = r ? r.getContext(t.value.outlet) : null;
  if (s && i.routeConfig === s.routeConfig) {
    let c = KD(s, i, i.routeConfig.runGuardsAndResolvers);
    c
      ? o.canActivateChecks.push(new fi(n))
      : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
      i.component ? nr(t, e, a ? a.children : null, n, o) : nr(t, e, r, n, o),
      c &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        o.canDeactivateChecks.push(new Dn(a.outlet.component, s));
  } else
    s && sr(e, a, o),
      o.canActivateChecks.push(new fi(n)),
      i.component
        ? nr(t, null, a ? a.children : null, n, o)
        : nr(t, null, r, n, o);
  return o;
}
function KD(t, e, r) {
  if (typeof r == "function") return r(t, e);
  switch (r) {
    case "pathParamsChange":
      return !Ft(t.url, e.url);
    case "pathParamsOrQueryParamsChange":
      return !Ft(t.url, e.url) || !He(t.queryParams, e.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !cc(t, e) || !He(t.queryParams, e.queryParams);
    case "paramsChange":
    default:
      return !cc(t, e);
  }
}
function sr(t, e, r) {
  let n = vn(t),
    o = t.value;
  Object.entries(n).forEach(([i, s]) => {
    o.component
      ? e
        ? sr(s, e.children.getContext(i), r)
        : sr(s, null, r)
      : sr(s, e, r);
  }),
    o.component
      ? e && e.outlet && e.outlet.isActivated
        ? r.canDeactivateChecks.push(new Dn(e.outlet.component, o))
        : r.canDeactivateChecks.push(new Dn(null, o))
      : r.canDeactivateChecks.push(new Dn(null, o));
}
function Dr(t) {
  return typeof t == "function";
}
function XD(t) {
  return typeof t == "boolean";
}
function eC(t) {
  return t && Dr(t.canLoad);
}
function tC(t) {
  return t && Dr(t.canActivate);
}
function nC(t) {
  return t && Dr(t.canActivateChild);
}
function rC(t) {
  return t && Dr(t.canDeactivate);
}
function oC(t) {
  return t && Dr(t.canMatch);
}
function th(t) {
  return t instanceof qe || t?.name === "EmptyError";
}
var ti = Symbol("INITIAL_VALUE");
function In() {
  return he((t) =>
    xn(t.map((e) => e.pipe(Ze(1), ki(ti)))).pipe(
      A((e) => {
        for (let r of e)
          if (r !== !0) {
            if (r === ti) return ti;
            if (r === !1 || r instanceof mt) return r;
          }
        return !0;
      }),
      fe((e) => e !== ti),
      Ze(1)
    )
  );
}
function iC(t, e) {
  return $((r) => {
    let {
      targetSnapshot: n,
      currentSnapshot: o,
      guards: { canActivateChecks: i, canDeactivateChecks: s },
    } = r;
    return s.length === 0 && i.length === 0
      ? C(H(g({}, r), { guardsResult: !0 }))
      : sC(s, n, o, t).pipe(
          $((a) => (a && XD(a) ? aC(n, i, t, e) : C(a))),
          A((a) => H(g({}, r), { guardsResult: a }))
        );
  });
}
function sC(t, e, r, n) {
  return B(t).pipe(
    $((o) => fC(o.component, o.route, r, e, n)),
    Re((o) => o !== !0, !0)
  );
}
function aC(t, e, r, n) {
  return B(e).pipe(
    It((o) =>
      Wt(
        uC(o.route.parent, n),
        cC(o.route, n),
        dC(t, o.path, r),
        lC(t, o.route, r)
      )
    ),
    Re((o) => o !== !0, !0)
  );
}
function cC(t, e) {
  return t !== null && e && e(new rc(t)), C(!0);
}
function uC(t, e) {
  return t !== null && e && e(new tc(t)), C(!0);
}
function lC(t, e, r) {
  let n = e.routeConfig ? e.routeConfig.canActivate : null;
  if (!n || n.length === 0) return C(!0);
  let o = n.map((i) =>
    Ur(() => {
      let s = yr(e) ?? r,
        a = bn(i, s),
        c = tC(a) ? a.canActivate(e, t) : pt(s, () => a(e, t));
      return Dt(c).pipe(Re());
    })
  );
  return C(o).pipe(In());
}
function dC(t, e, r) {
  let n = e[e.length - 1],
    i = e
      .slice(0, e.length - 1)
      .reverse()
      .map((s) => QD(s))
      .filter((s) => s !== null)
      .map((s) =>
        Ur(() => {
          let a = s.guards.map((c) => {
            let u = yr(s.node) ?? r,
              l = bn(c, u),
              d = nC(l) ? l.canActivateChild(n, t) : pt(u, () => l(n, t));
            return Dt(d).pipe(Re());
          });
          return C(a).pipe(In());
        })
      );
  return C(i).pipe(In());
}
function fC(t, e, r, n, o) {
  let i = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
  if (!i || i.length === 0) return C(!0);
  let s = i.map((a) => {
    let c = yr(e) ?? o,
      u = bn(a, c),
      l = rC(u) ? u.canDeactivate(t, e, r, n) : pt(c, () => u(t, e, r, n));
    return Dt(l).pipe(Re());
  });
  return C(s).pipe(In());
}
function hC(t, e, r, n) {
  let o = e.canLoad;
  if (o === void 0 || o.length === 0) return C(!0);
  let i = o.map((s) => {
    let a = bn(s, t),
      c = eC(a) ? a.canLoad(e, r) : pt(t, () => a(e, r));
    return Dt(c);
  });
  return C(i).pipe(In(), nh(n));
}
function nh(t) {
  return Ti(
    Z((e) => {
      if (wn(e)) throw Kf(t, e);
    }),
    A((e) => e === !0)
  );
}
function pC(t, e, r, n) {
  let o = e.canMatch;
  if (!o || o.length === 0) return C(!0);
  let i = o.map((s) => {
    let a = bn(s, t),
      c = oC(a) ? a.canMatch(e, r) : pt(t, () => a(e, r));
    return Dt(c);
  });
  return C(i).pipe(In(), nh(n));
}
var pr = class {
    constructor(e) {
      this.segmentGroup = e || null;
    }
  },
  hi = class extends Error {
    constructor(e) {
      super(), (this.urlTree = e);
    }
  };
function mn(t) {
  return zt(new pr(t));
}
function gC(t) {
  return zt(new m(4e3, !1));
}
function mC(t) {
  return zt(Xf(!1, 3));
}
var dc = class {
    constructor(e, r) {
      (this.urlSerializer = e), (this.urlTree = r);
    }
    lineralizeSegments(e, r) {
      let n = [],
        o = r.root;
      for (;;) {
        if (((n = n.concat(o.segments)), o.numberOfChildren === 0)) return C(n);
        if (o.numberOfChildren > 1 || !o.children[b]) return gC(e.redirectTo);
        o = o.children[b];
      }
    }
    applyRedirectCommands(e, r, n) {
      let o = this.applyRedirectCreateUrlTree(
        r,
        this.urlSerializer.parse(r),
        e,
        n
      );
      if (r.startsWith("/")) throw new hi(o);
      return o;
    }
    applyRedirectCreateUrlTree(e, r, n, o) {
      let i = this.createSegmentGroup(e, r.root, n, o);
      return new mt(
        i,
        this.createQueryParams(r.queryParams, this.urlTree.queryParams),
        r.fragment
      );
    }
    createQueryParams(e, r) {
      let n = {};
      return (
        Object.entries(e).forEach(([o, i]) => {
          if (typeof i == "string" && i.startsWith(":")) {
            let a = i.substring(1);
            n[o] = r[a];
          } else n[o] = i;
        }),
        n
      );
    }
    createSegmentGroup(e, r, n, o) {
      let i = this.createSegments(e, r.segments, n, o),
        s = {};
      return (
        Object.entries(r.children).forEach(([a, c]) => {
          s[a] = this.createSegmentGroup(e, c, n, o);
        }),
        new N(i, s)
      );
    }
    createSegments(e, r, n, o) {
      return r.map((i) =>
        i.path.startsWith(":")
          ? this.findPosParam(e, i, o)
          : this.findOrReturn(i, n)
      );
    }
    findPosParam(e, r, n) {
      let o = n[r.path.substring(1)];
      if (!o) throw new m(4001, !1);
      return o;
    }
    findOrReturn(e, r) {
      let n = 0;
      for (let o of r) {
        if (o.path === e.path) return r.splice(n), o;
        n++;
      }
      return e;
    }
  },
  fc = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function vC(t, e, r, n, o) {
  let i = Cc(t, e, r);
  return i.matched
    ? ((n = WD(e, n)),
      pC(n, e, r, o).pipe(A((s) => (s === !0 ? i : g({}, fc)))))
    : C(i);
}
function Cc(t, e, r) {
  if (e.path === "**") return yC(r);
  if (e.path === "")
    return e.pathMatch === "full" && (t.hasChildren() || r.length > 0)
      ? g({}, fc)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: r,
          parameters: {},
          positionalParamSegments: {},
        };
  let o = (e.matcher || pD)(r, t, e);
  if (!o) return g({}, fc);
  let i = {};
  Object.entries(o.posParams ?? {}).forEach(([a, c]) => {
    i[a] = c.path;
  });
  let s =
    o.consumed.length > 0
      ? g(g({}, i), o.consumed[o.consumed.length - 1].parameters)
      : i;
  return {
    matched: !0,
    consumedSegments: o.consumed,
    remainingSegments: r.slice(o.consumed.length),
    parameters: s,
    positionalParamSegments: o.posParams ?? {},
  };
}
function yC(t) {
  return {
    matched: !0,
    parameters: t.length > 0 ? Ff(t).parameters : {},
    consumedSegments: t,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function Nf(t, e, r, n) {
  return r.length > 0 && wC(t, r, n)
    ? {
        segmentGroup: new N(e, CC(n, new N(r, t.children))),
        slicedSegments: [],
      }
    : r.length === 0 && EC(t, r, n)
    ? {
        segmentGroup: new N(t.segments, DC(t, e, r, n, t.children)),
        slicedSegments: r,
      }
    : { segmentGroup: new N(t.segments, t.children), slicedSegments: r };
}
function DC(t, e, r, n, o) {
  let i = {};
  for (let s of n)
    if (vi(t, r, s) && !o[ze(s)]) {
      let a = new N([], {});
      i[ze(s)] = a;
    }
  return g(g({}, o), i);
}
function CC(t, e) {
  let r = {};
  r[b] = e;
  for (let n of t)
    if (n.path === "" && ze(n) !== b) {
      let o = new N([], {});
      r[ze(n)] = o;
    }
  return r;
}
function wC(t, e, r) {
  return r.some((n) => vi(t, e, n) && ze(n) !== b);
}
function EC(t, e, r) {
  return r.some((n) => vi(t, e, n));
}
function vi(t, e, r) {
  return (t.hasChildren() || e.length > 0) && r.pathMatch === "full"
    ? !1
    : r.path === "";
}
function IC(t, e, r, n) {
  return ze(t) !== n && (n === b || !vi(e, r, t)) ? !1 : Cc(e, t, r).matched;
}
function bC(t, e, r) {
  return e.length === 0 && !t.children[r];
}
var hc = class {};
function MC(t, e, r, n, o, i, s = "emptyOnly") {
  return new pc(t, e, r, n, o, s, i).recognize();
}
var SC = 31,
  pc = class {
    constructor(e, r, n, o, i, s, a) {
      (this.injector = e),
        (this.configLoader = r),
        (this.rootComponentType = n),
        (this.config = o),
        (this.urlTree = i),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new dc(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(e) {
      return new m(4002, `'${e.segmentGroup}'`);
    }
    recognize() {
      let e = Nf(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(e).pipe(
        A((r) => {
          let n = new fr(
              [],
              Object.freeze({}),
              Object.freeze(g({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              b,
              this.rootComponentType,
              null,
              {}
            ),
            o = new le(n, r),
            i = new di("", o),
            s = RD(n, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (i.url = this.urlSerializer.serialize(s)),
            this.inheritParamsAndData(i._root, null),
            { state: i, tree: s }
          );
        })
      );
    }
    match(e) {
      return this.processSegmentGroup(this.injector, this.config, e, b).pipe(
        rt((n) => {
          if (n instanceof hi)
            return (this.urlTree = n.urlTree), this.match(n.urlTree.root);
          throw n instanceof pr ? this.noMatchError(n) : n;
        })
      );
    }
    inheritParamsAndData(e, r) {
      let n = e.value,
        o = mc(n, r, this.paramsInheritanceStrategy);
      (n.params = Object.freeze(o.params)),
        (n.data = Object.freeze(o.data)),
        e.children.forEach((i) => this.inheritParamsAndData(i, n));
    }
    processSegmentGroup(e, r, n, o) {
      return n.segments.length === 0 && n.hasChildren()
        ? this.processChildren(e, r, n)
        : this.processSegment(e, r, n, n.segments, o, !0).pipe(
            A((i) => (i instanceof le ? [i] : []))
          );
    }
    processChildren(e, r, n) {
      let o = [];
      for (let i of Object.keys(n.children))
        i === "primary" ? o.unshift(i) : o.push(i);
      return B(o).pipe(
        It((i) => {
          let s = n.children[i],
            a = qD(r, i);
          return this.processSegmentGroup(e, a, s, i);
        }),
        Fi((i, s) => (i.push(...s), i)),
        ot(null),
        Pi(),
        $((i) => {
          if (i === null) return mn(n);
          let s = rh(i);
          return xC(s), C(s);
        })
      );
    }
    processSegment(e, r, n, o, i, s) {
      return B(r).pipe(
        It((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? e,
            r,
            a,
            n,
            o,
            i,
            s
          ).pipe(
            rt((c) => {
              if (c instanceof pr) return C(null);
              throw c;
            })
          )
        ),
        Re((a) => !!a),
        rt((a) => {
          if (th(a)) return bC(n, o, i) ? C(new hc()) : mn(n);
          throw a;
        })
      );
    }
    processSegmentAgainstRoute(e, r, n, o, i, s, a) {
      return IC(n, o, i, s)
        ? n.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(e, o, n, i, s)
          : this.allowRedirects && a
          ? this.expandSegmentAgainstRouteUsingRedirect(e, o, r, n, i, s)
          : mn(o)
        : mn(o);
    }
    expandSegmentAgainstRouteUsingRedirect(e, r, n, o, i, s) {
      let {
        matched: a,
        consumedSegments: c,
        positionalParamSegments: u,
        remainingSegments: l,
      } = Cc(r, o, i);
      if (!a) return mn(r);
      o.redirectTo.startsWith("/") &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > SC && (this.allowRedirects = !1));
      let d = this.applyRedirects.applyRedirectCommands(c, o.redirectTo, u);
      return this.applyRedirects
        .lineralizeSegments(o, d)
        .pipe($((f) => this.processSegment(e, n, r, f.concat(l), s, !1)));
    }
    matchSegmentAgainstRoute(e, r, n, o, i) {
      let s = vC(r, n, o, e, this.urlSerializer);
      return (
        n.path === "**" && (r.children = {}),
        s.pipe(
          he((a) =>
            a.matched
              ? ((e = n._injector ?? e),
                this.getChildConfig(e, n, o).pipe(
                  he(({ routes: c }) => {
                    let u = n._loadedInjector ?? e,
                      {
                        consumedSegments: l,
                        remainingSegments: d,
                        parameters: f,
                      } = a,
                      h = new fr(
                        l,
                        f,
                        Object.freeze(g({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        AC(n),
                        ze(n),
                        n.component ?? n._loadedComponent ?? null,
                        n,
                        _C(n)
                      ),
                      { segmentGroup: w, slicedSegments: O } = Nf(r, l, d, c);
                    if (O.length === 0 && w.hasChildren())
                      return this.processChildren(u, c, w).pipe(
                        A((j) => (j === null ? null : new le(h, j)))
                      );
                    if (c.length === 0 && O.length === 0)
                      return C(new le(h, []));
                    let K = ze(n) === i;
                    return this.processSegment(u, c, w, O, K ? b : i, !0).pipe(
                      A((j) => new le(h, j instanceof le ? [j] : []))
                    );
                  })
                ))
              : mn(r)
          )
        )
      );
    }
    getChildConfig(e, r, n) {
      return r.children
        ? C({ routes: r.children, injector: e })
        : r.loadChildren
        ? r._loadedRoutes !== void 0
          ? C({ routes: r._loadedRoutes, injector: r._loadedInjector })
          : hC(e, r, n, this.urlSerializer).pipe(
              $((o) =>
                o
                  ? this.configLoader.loadChildren(e, r).pipe(
                      Z((i) => {
                        (r._loadedRoutes = i.routes),
                          (r._loadedInjector = i.injector);
                      })
                    )
                  : mC(r)
              )
            )
        : C({ routes: [], injector: e });
    }
  };
function xC(t) {
  t.sort((e, r) =>
    e.value.outlet === b
      ? -1
      : r.value.outlet === b
      ? 1
      : e.value.outlet.localeCompare(r.value.outlet)
  );
}
function TC(t) {
  let e = t.value.routeConfig;
  return e && e.path === "";
}
function rh(t) {
  let e = [],
    r = new Set();
  for (let n of t) {
    if (!TC(n)) {
      e.push(n);
      continue;
    }
    let o = e.find((i) => n.value.routeConfig === i.value.routeConfig);
    o !== void 0 ? (o.children.push(...n.children), r.add(o)) : e.push(n);
  }
  for (let n of r) {
    let o = rh(n.children);
    e.push(new le(n.value, o));
  }
  return e.filter((n) => !r.has(n));
}
function AC(t) {
  return t.data || {};
}
function _C(t) {
  return t.resolve || {};
}
function NC(t, e, r, n, o, i) {
  return $((s) =>
    MC(t, e, r, n, s.extractedUrl, o, i).pipe(
      A(({ state: a, tree: c }) =>
        H(g({}, s), { targetSnapshot: a, urlAfterRedirects: c })
      )
    )
  );
}
function OC(t, e) {
  return $((r) => {
    let {
      targetSnapshot: n,
      guards: { canActivateChecks: o },
    } = r;
    if (!o.length) return C(r);
    let i = new Set(o.map((c) => c.route)),
      s = new Set();
    for (let c of i) if (!s.has(c)) for (let u of oh(c)) s.add(u);
    let a = 0;
    return B(s).pipe(
      It((c) =>
        i.has(c)
          ? RC(c, n, t, e)
          : ((c.data = mc(c, c.parent, t).resolve), C(void 0))
      ),
      Z(() => a++),
      qt(1),
      $((c) => (a === s.size ? C(r) : de))
    );
  });
}
function oh(t) {
  let e = t.children.map((r) => oh(r)).flat();
  return [t, ...e];
}
function RC(t, e, r, n) {
  let o = t.routeConfig,
    i = t._resolve;
  return (
    o?.title !== void 0 && !Qf(o) && (i[gr] = o.title),
    PC(i, t, e, n).pipe(
      A(
        (s) => (
          (t._resolvedData = s), (t.data = mc(t, t.parent, r).resolve), null
        )
      )
    )
  );
}
function PC(t, e, r, n) {
  let o = Ga(t);
  if (o.length === 0) return C({});
  let i = {};
  return B(o).pipe(
    $((s) =>
      FC(t[s], e, r, n).pipe(
        Re(),
        Z((a) => {
          i[s] = a;
        })
      )
    ),
    qt(1),
    Ri(i),
    rt((s) => (th(s) ? de : zt(s)))
  );
}
function FC(t, e, r, n) {
  let o = yr(e) ?? n,
    i = bn(t, o),
    s = i.resolve ? i.resolve(e, r) : pt(o, () => i(e, r));
  return Dt(s);
}
function $a(t) {
  return he((e) => {
    let r = t(e);
    return r ? B(r).pipe(A(() => e)) : C(e);
  });
}
var ih = (() => {
    let e = class e {
      buildTitle(n) {
        let o,
          i = n.root;
        for (; i !== void 0; )
          (o = this.getResolvedTitleForRoute(i) ?? o),
            (i = i.children.find((s) => s.outlet === b));
        return o;
      }
      getResolvedTitleForRoute(n) {
        return n.data[gr];
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵprov = y({
        token: e,
        factory: () => (() => p(kC))(),
        providedIn: "root",
      }));
    let t = e;
    return t;
  })(),
  kC = (() => {
    let e = class e extends ih {
      constructor(n) {
        super(), (this.title = n);
      }
      updateTitle(n) {
        let o = this.buildTitle(n);
        o !== void 0 && this.title.setTitle(o);
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)(v(Va));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Cr = new I("", { providedIn: "root", factory: () => ({}) }),
  pi = new I("ROUTES"),
  wc = (() => {
    let e = class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = p(Bo));
      }
      loadComponent(n) {
        if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
        if (n._loadedComponent) return C(n._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(n);
        let o = Dt(n.loadComponent()).pipe(
            A(sh),
            Z((s) => {
              this.onLoadEndListener && this.onLoadEndListener(n),
                (n._loadedComponent = s);
            }),
            Tn(() => {
              this.componentLoaders.delete(n);
            })
          ),
          i = new $t(o, () => new re()).pipe(Ht());
        return this.componentLoaders.set(n, i), i;
      }
      loadChildren(n, o) {
        if (this.childrenLoaders.get(o)) return this.childrenLoaders.get(o);
        if (o._loadedRoutes)
          return C({ routes: o._loadedRoutes, injector: o._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(o);
        let s = LC(o, this.compiler, n, this.onLoadEndListener).pipe(
            Tn(() => {
              this.childrenLoaders.delete(o);
            })
          ),
          a = new $t(s, () => new re()).pipe(Ht());
        return this.childrenLoaders.set(o, a), a;
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function LC(t, e, r, n) {
  return Dt(t.loadChildren()).pipe(
    A(sh),
    $((o) =>
      o instanceof Bn || Array.isArray(o) ? C(o) : B(e.compileModuleAsync(o))
    ),
    A((o) => {
      n && n(t);
      let i,
        s,
        a = !1;
      return (
        Array.isArray(o)
          ? ((s = o), (a = !0))
          : ((i = o.create(r).injector),
            (s = i.get(pi, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(Dc), injector: i }
      );
    })
  );
}
function jC(t) {
  return t && typeof t == "object" && "default" in t;
}
function sh(t) {
  return jC(t) ? t.default : t;
}
var Ec = (() => {
    let e = class e {};
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵprov = y({
        token: e,
        factory: () => (() => p(VC))(),
        providedIn: "root",
      }));
    let t = e;
    return t;
  })(),
  VC = (() => {
    let e = class e {
      shouldProcessUrl(n) {
        return !0;
      }
      extract(n) {
        return n;
      }
      merge(n, o) {
        return n;
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  ah = new I(""),
  ch = new I("");
function UC(t, e, r) {
  let n = t.get(ch),
    o = t.get(ne);
  return t.get(L).runOutsideAngular(() => {
    if (!o.startViewTransition || n.skipNextTransition)
      return (n.skipNextTransition = !1), Promise.resolve();
    let i,
      s = new Promise((u) => {
        i = u;
      }),
      a = o.startViewTransition(() => (i(), BC(t))),
      { onViewTransitionCreated: c } = n;
    return c && pt(t, () => c({ transition: a, from: e, to: r })), s;
  });
}
function BC(t) {
  return new Promise((e) => {
    fa(e, { injector: t });
  });
}
var Ic = (() => {
  let e = class e {
    get hasRequestedNavigation() {
      return this.navigationId !== 0;
    }
    constructor() {
      (this.currentNavigation = null),
        (this.currentTransition = null),
        (this.lastSuccessfulNavigation = null),
        (this.events = new re()),
        (this.transitionAbortSubject = new re()),
        (this.configLoader = p(wc)),
        (this.environmentInjector = p(ue)),
        (this.urlSerializer = p(mr)),
        (this.rootContexts = p(vr)),
        (this.location = p(gn)),
        (this.inputBindingEnabled = p(mi, { optional: !0 }) !== null),
        (this.titleStrategy = p(ih)),
        (this.options = p(Cr, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || "emptyOnly"),
        (this.urlHandlingStrategy = p(Ec)),
        (this.createViewTransition = p(ah, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => C(void 0)),
        (this.rootComponentType = null);
      let n = (i) => this.events.next(new Xa(i)),
        o = (i) => this.events.next(new ec(i));
      (this.configLoader.onLoadEndListener = o),
        (this.configLoader.onLoadStartListener = n);
    }
    complete() {
      this.transitions?.complete();
    }
    handleNavigationRequest(n) {
      let o = ++this.navigationId;
      this.transitions?.next(H(g(g({}, this.transitions.value), n), { id: o }));
    }
    setupNavigations(n, o, i) {
      return (
        (this.transitions = new Q({
          id: 0,
          currentUrlTree: o,
          currentRawUrl: o,
          extractedUrl: this.urlHandlingStrategy.extract(o),
          urlAfterRedirects: this.urlHandlingStrategy.extract(o),
          rawUrl: o,
          extras: {},
          resolve: null,
          reject: null,
          promise: Promise.resolve(!0),
          source: ir,
          restoredState: null,
          currentSnapshot: i.snapshot,
          targetSnapshot: null,
          currentRouterState: i,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          fe((s) => s.id !== 0),
          A((s) =>
            H(g({}, s), {
              extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
            })
          ),
          he((s) => {
            this.currentTransition = s;
            let a = !1,
              c = !1;
            return C(s).pipe(
              Z((u) => {
                this.currentNavigation = {
                  id: u.id,
                  initialUrl: u.rawUrl,
                  extractedUrl: u.extractedUrl,
                  trigger: u.source,
                  extras: u.extras,
                  previousNavigation: this.lastSuccessfulNavigation
                    ? H(g({}, this.lastSuccessfulNavigation), {
                        previousNavigation: null,
                      })
                    : null,
                };
              }),
              he((u) => {
                let l =
                    !n.navigated ||
                    this.isUpdatingInternalState() ||
                    this.isUpdatedBrowserUrl(),
                  d = u.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                if (!l && d !== "reload") {
                  let f = "";
                  return (
                    this.events.next(
                      new yt(u.id, this.urlSerializer.serialize(u.rawUrl), f, 0)
                    ),
                    u.resolve(null),
                    de
                  );
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(u.rawUrl))
                  return C(u).pipe(
                    he((f) => {
                      let h = this.transitions?.getValue();
                      return (
                        this.events.next(
                          new En(
                            f.id,
                            this.urlSerializer.serialize(f.extractedUrl),
                            f.source,
                            f.restoredState
                          )
                        ),
                        h !== this.transitions?.getValue()
                          ? de
                          : Promise.resolve(f)
                      );
                    }),
                    NC(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      n.config,
                      this.urlSerializer,
                      this.paramsInheritanceStrategy
                    ),
                    Z((f) => {
                      (s.targetSnapshot = f.targetSnapshot),
                        (s.urlAfterRedirects = f.urlAfterRedirects),
                        (this.currentNavigation = H(
                          g({}, this.currentNavigation),
                          { finalUrl: f.urlAfterRedirects }
                        ));
                      let h = new ai(
                        f.id,
                        this.urlSerializer.serialize(f.extractedUrl),
                        this.urlSerializer.serialize(f.urlAfterRedirects),
                        f.targetSnapshot
                      );
                      this.events.next(h);
                    })
                  );
                if (
                  l &&
                  this.urlHandlingStrategy.shouldProcessUrl(u.currentRawUrl)
                ) {
                  let {
                      id: f,
                      extractedUrl: h,
                      source: w,
                      restoredState: O,
                      extras: K,
                    } = u,
                    j = new En(f, this.urlSerializer.serialize(h), w, O);
                  this.events.next(j);
                  let se = Zf(h, this.rootComponentType).snapshot;
                  return (
                    (this.currentTransition = s =
                      H(g({}, u), {
                        targetSnapshot: se,
                        urlAfterRedirects: h,
                        extras: H(g({}, K), {
                          skipLocationChange: !1,
                          replaceUrl: !1,
                        }),
                      })),
                    (this.currentNavigation.finalUrl = h),
                    C(s)
                  );
                } else {
                  let f = "";
                  return (
                    this.events.next(
                      new yt(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        f,
                        1
                      )
                    ),
                    u.resolve(null),
                    de
                  );
                }
              }),
              Z((u) => {
                let l = new Ya(
                  u.id,
                  this.urlSerializer.serialize(u.extractedUrl),
                  this.urlSerializer.serialize(u.urlAfterRedirects),
                  u.targetSnapshot
                );
                this.events.next(l);
              }),
              A(
                (u) => (
                  (this.currentTransition = s =
                    H(g({}, u), {
                      guards: YD(
                        u.targetSnapshot,
                        u.currentSnapshot,
                        this.rootContexts
                      ),
                    })),
                  s
                )
              ),
              iC(this.environmentInjector, (u) => this.events.next(u)),
              Z((u) => {
                if (((s.guardsResult = u.guardsResult), wn(u.guardsResult)))
                  throw Kf(this.urlSerializer, u.guardsResult);
                let l = new Qa(
                  u.id,
                  this.urlSerializer.serialize(u.extractedUrl),
                  this.urlSerializer.serialize(u.urlAfterRedirects),
                  u.targetSnapshot,
                  !!u.guardsResult
                );
                this.events.next(l);
              }),
              fe((u) =>
                u.guardsResult
                  ? !0
                  : (this.cancelNavigationTransition(u, "", 3), !1)
              ),
              $a((u) => {
                if (u.guards.canActivateChecks.length)
                  return C(u).pipe(
                    Z((l) => {
                      let d = new Ja(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects),
                        l.targetSnapshot
                      );
                      this.events.next(d);
                    }),
                    he((l) => {
                      let d = !1;
                      return C(l).pipe(
                        OC(
                          this.paramsInheritanceStrategy,
                          this.environmentInjector
                        ),
                        Z({
                          next: () => (d = !0),
                          complete: () => {
                            d || this.cancelNavigationTransition(l, "", 2);
                          },
                        })
                      );
                    }),
                    Z((l) => {
                      let d = new Ka(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects),
                        l.targetSnapshot
                      );
                      this.events.next(d);
                    })
                  );
              }),
              $a((u) => {
                let l = (d) => {
                  let f = [];
                  d.routeConfig?.loadComponent &&
                    !d.routeConfig._loadedComponent &&
                    f.push(
                      this.configLoader.loadComponent(d.routeConfig).pipe(
                        Z((h) => {
                          d.component = h;
                        }),
                        A(() => {})
                      )
                    );
                  for (let h of d.children) f.push(...l(h));
                  return f;
                };
                return xn(l(u.targetSnapshot.root)).pipe(ot(null), Ze(1));
              }),
              $a(() => this.afterPreactivation()),
              he(() => {
                let { currentSnapshot: u, targetSnapshot: l } = s,
                  d = this.createViewTransition?.(
                    this.environmentInjector,
                    u.root,
                    l.root
                  );
                return d ? B(d).pipe(A(() => s)) : C(s);
              }),
              A((u) => {
                let l = BD(
                  n.routeReuseStrategy,
                  u.targetSnapshot,
                  u.currentRouterState
                );
                return (
                  (this.currentTransition = s =
                    H(g({}, u), { targetRouterState: l })),
                  (this.currentNavigation.targetRouterState = l),
                  s
                );
              }),
              Z(() => {
                this.events.next(new lr());
              }),
              ZD(
                this.rootContexts,
                n.routeReuseStrategy,
                (u) => this.events.next(u),
                this.inputBindingEnabled
              ),
              Ze(1),
              Z({
                next: (u) => {
                  (a = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new $e(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects)
                      )
                    ),
                    this.titleStrategy?.updateTitle(
                      u.targetRouterState.snapshot
                    ),
                    u.resolve(!0);
                },
                complete: () => {
                  a = !0;
                },
              }),
              Li(
                this.transitionAbortSubject.pipe(
                  Z((u) => {
                    throw u;
                  })
                )
              ),
              Tn(() => {
                if (!a && !c) {
                  let u = "";
                  this.cancelNavigationTransition(s, u, 1);
                }
                this.currentNavigation?.id === s.id &&
                  (this.currentNavigation = null);
              }),
              rt((u) => {
                if (((c = !0), eh(u)))
                  this.events.next(
                    new vt(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      u.message,
                      u.cancellationCode
                    )
                  ),
                    zD(u) ? this.events.next(new dr(u.url)) : s.resolve(!1);
                else {
                  this.events.next(
                    new ur(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      u,
                      s.targetSnapshot ?? void 0
                    )
                  );
                  try {
                    s.resolve(n.errorHandler(u));
                  } catch (l) {
                    s.reject(l);
                  }
                }
                return de;
              })
            );
          })
        )
      );
    }
    cancelNavigationTransition(n, o, i) {
      let s = new vt(n.id, this.urlSerializer.serialize(n.extractedUrl), o, i);
      this.events.next(s), n.resolve(!1);
    }
    isUpdatingInternalState() {
      return (
        this.currentTransition?.extractedUrl.toString() !==
        this.currentTransition?.currentUrlTree.toString()
      );
    }
    isUpdatedBrowserUrl() {
      return (
        this.urlHandlingStrategy
          .extract(this.urlSerializer.parse(this.location.path(!0)))
          .toString() !== this.currentTransition?.extractedUrl.toString() &&
        !this.currentTransition?.extras.skipLocationChange
      );
    }
  };
  (e.ɵfac = function (o) {
    return new (o || e)();
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function HC(t) {
  return t !== ir;
}
var $C = (() => {
    let e = class e {};
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵprov = y({
        token: e,
        factory: () => (() => p(zC))(),
        providedIn: "root",
      }));
    let t = e;
    return t;
  })(),
  gc = class {
    shouldDetach(e) {
      return !1;
    }
    store(e, r) {}
    shouldAttach(e) {
      return !1;
    }
    retrieve(e) {
      return null;
    }
    shouldReuseRoute(e, r) {
      return e.routeConfig === r.routeConfig;
    }
  },
  zC = (() => {
    let e = class e extends gc {};
    (e.ɵfac = (() => {
      let n;
      return function (i) {
        return (n || (n = Ws(e)))(i || e);
      };
    })()),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  uh = (() => {
    let e = class e {};
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵprov = y({
        token: e,
        factory: () => (() => p(GC))(),
        providedIn: "root",
      }));
    let t = e;
    return t;
  })(),
  GC = (() => {
    let e = class e extends uh {
      constructor() {
        super(...arguments),
          (this.location = p(gn)),
          (this.urlSerializer = p(mr)),
          (this.options = p(Cr, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = p(Ec)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new mt()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = Zf(this.currentUrlTree, null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(n) {
        return this.location.subscribe((o) => {
          o.type === "popstate" && n(o.url, o.state);
        });
      }
      handleRouterEvent(n, o) {
        if (n instanceof En) this.stateMemento = this.createStateMemento();
        else if (n instanceof yt) this.rawUrlTree = o.initialUrl;
        else if (n instanceof ai) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !o.extras.skipLocationChange
          ) {
            let i = this.urlHandlingStrategy.merge(o.finalUrl, o.initialUrl);
            this.setBrowserUrl(i, o);
          }
        } else
          n instanceof lr
            ? ((this.currentUrlTree = o.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                o.finalUrl,
                o.initialUrl
              )),
              (this.routerState = o.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                (o.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, o)))
            : n instanceof vt && (n.code === 3 || n.code === 2)
            ? this.restoreHistory(o)
            : n instanceof ur
            ? this.restoreHistory(o, !0)
            : n instanceof $e &&
              ((this.lastSuccessfulId = n.id),
              (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(n, o) {
        let i = this.urlSerializer.serialize(n);
        if (this.location.isCurrentPathEqualTo(i) || o.extras.replaceUrl) {
          let s = this.browserPageId,
            a = g(g({}, o.extras.state), this.generateNgRouterState(o.id, s));
          this.location.replaceState(i, "", a);
        } else {
          let s = g(
            g({}, o.extras.state),
            this.generateNgRouterState(o.id, this.browserPageId + 1)
          );
          this.location.go(i, "", s);
        }
      }
      restoreHistory(n, o = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let i = this.browserPageId,
            s = this.currentPageId - i;
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === n.finalUrl &&
              s === 0 &&
              (this.resetState(n), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (o && this.resetState(n), this.resetUrlToCurrentUrlTree());
      }
      resetState(n) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            n.finalUrl ?? this.rawUrlTree
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId)
        );
      }
      generateNgRouterState(n, o) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: n, ɵrouterPageId: o }
          : { navigationId: n };
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (i) {
        return (n || (n = Ws(e)))(i || e);
      };
    })()),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  rr = (function (t) {
    return (
      (t[(t.COMPLETE = 0)] = "COMPLETE"),
      (t[(t.FAILED = 1)] = "FAILED"),
      (t[(t.REDIRECTING = 2)] = "REDIRECTING"),
      t
    );
  })(rr || {});
function lh(t, e) {
  t.events
    .pipe(
      fe(
        (r) =>
          r instanceof $e ||
          r instanceof vt ||
          r instanceof ur ||
          r instanceof yt
      ),
      A((r) =>
        r instanceof $e || r instanceof yt
          ? rr.COMPLETE
          : (r instanceof vt ? r.code === 0 || r.code === 1 : !1)
          ? rr.REDIRECTING
          : rr.FAILED
      ),
      fe((r) => r !== rr.REDIRECTING),
      Ze(1)
    )
    .subscribe(() => {
      e();
    });
}
function WC(t) {
  throw t;
}
var qC = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  ZC = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  ie = (() => {
    let e = class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.isNgZoneEnabled = !1),
          (this.console = p(Uo)),
          (this.stateManager = p(uh)),
          (this.options = p(Cr, { optional: !0 }) || {}),
          (this.pendingTasks = p(Ho)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = p(Ic)),
          (this.urlSerializer = p(mr)),
          (this.location = p(gn)),
          (this.urlHandlingStrategy = p(Ec)),
          (this._events = new re()),
          (this.errorHandler = this.options.errorHandler || WC),
          (this.navigated = !1),
          (this.routeReuseStrategy = p($C)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = p(pi, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!p(mi, { optional: !0 })),
          (this.eventsSubscription = new z()),
          (this.isNgZoneEnabled = p(L) instanceof L && L.isInAngularZone()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (n) => {
                this.console.warn(n);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let n = this.navigationTransitions.events.subscribe((o) => {
          try {
            let i = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation;
            if (i !== null && s !== null) {
              if (
                (this.stateManager.handleRouterEvent(o, s),
                o instanceof vt && o.code !== 0 && o.code !== 1)
              )
                this.navigated = !0;
              else if (o instanceof $e) this.navigated = !0;
              else if (o instanceof dr) {
                let a = this.urlHandlingStrategy.merge(o.url, i.currentRawUrl),
                  c = {
                    skipLocationChange: i.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === "eager" || HC(i.source),
                  };
                this.scheduleNavigation(a, ir, null, c, {
                  resolve: i.resolve,
                  reject: i.reject,
                  promise: i.promise,
                });
              }
            }
            QC(o) && this._events.next(o);
          } catch (i) {
            this.navigationTransitions.transitionAbortSubject.next(i);
          }
        });
        this.eventsSubscription.add(n);
      }
      resetRootComponentType(n) {
        (this.routerState.root.component = n),
          (this.navigationTransitions.rootComponentType = n);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              ir,
              this.stateManager.restoredState()
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ||
          (this.nonRouterCurrentEntryChangeSubscription =
            this.stateManager.registerNonRouterCurrentEntryChangeListener(
              (n, o) => {
                setTimeout(() => {
                  this.navigateToSyncWithBrowser(n, "popstate", o);
                }, 0);
              }
            ));
      }
      navigateToSyncWithBrowser(n, o, i) {
        let s = { replaceUrl: !0 },
          a = i?.navigationId ? i : null;
        if (i) {
          let u = g({}, i);
          delete u.navigationId,
            delete u.ɵrouterPageId,
            Object.keys(u).length !== 0 && (s.state = u);
        }
        let c = this.parseUrl(n);
        this.scheduleNavigation(c, o, a, s);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(n) {
        (this.config = n.map(Dc)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(n, o = {}) {
        let {
            relativeTo: i,
            queryParams: s,
            fragment: a,
            queryParamsHandling: c,
            preserveFragment: u,
          } = o,
          l = u ? this.currentUrlTree.fragment : a,
          d = null;
        switch (c) {
          case "merge":
            d = g(g({}, this.currentUrlTree.queryParams), s);
            break;
          case "preserve":
            d = this.currentUrlTree.queryParams;
            break;
          default:
            d = s || null;
        }
        d !== null && (d = this.removeEmptyProps(d));
        let f;
        try {
          let h = i ? i.snapshot : this.routerState.snapshot.root;
          f = zf(h);
        } catch {
          (typeof n[0] != "string" || !n[0].startsWith("/")) && (n = []),
            (f = this.currentUrlTree.root);
        }
        return Gf(f, n, d, l ?? null);
      }
      navigateByUrl(n, o = { skipLocationChange: !1 }) {
        let i = wn(n) ? n : this.parseUrl(n),
          s = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
        return this.scheduleNavigation(s, ir, null, o);
      }
      navigate(n, o = { skipLocationChange: !1 }) {
        return YC(n), this.navigateByUrl(this.createUrlTree(n, o), o);
      }
      serializeUrl(n) {
        return this.urlSerializer.serialize(n);
      }
      parseUrl(n) {
        try {
          return this.urlSerializer.parse(n);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(n, o) {
        let i;
        if (
          (o === !0 ? (i = g({}, qC)) : o === !1 ? (i = g({}, ZC)) : (i = o),
          wn(n))
        )
          return Sf(this.currentUrlTree, n, i);
        let s = this.parseUrl(n);
        return Sf(this.currentUrlTree, s, i);
      }
      removeEmptyProps(n) {
        return Object.keys(n).reduce((o, i) => {
          let s = n[i];
          return s != null && (o[i] = s), o;
        }, {});
      }
      scheduleNavigation(n, o, i, s, a) {
        if (this.disposed) return Promise.resolve(!1);
        let c, u, l;
        a
          ? ((c = a.resolve), (u = a.reject), (l = a.promise))
          : (l = new Promise((f, h) => {
              (c = f), (u = h);
            }));
        let d = this.pendingTasks.add();
        return (
          lh(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: o,
            restoredState: i,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
            extras: s,
            resolve: c,
            reject: u,
            promise: l,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          l.catch((f) => Promise.reject(f))
        );
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function YC(t) {
  for (let e = 0; e < t.length; e++) if (t[e] == null) throw new m(4008, !1);
}
function QC(t) {
  return !(t instanceof lr) && !(t instanceof dr);
}
var dh = (() => {
  let e = class e {
    constructor(n, o, i, s, a, c) {
      (this.router = n),
        (this.route = o),
        (this.tabIndexAttribute = i),
        (this.renderer = s),
        (this.el = a),
        (this.locationStrategy = c),
        (this.href = null),
        (this.commands = null),
        (this.onChanges = new re()),
        (this.preserveFragment = !1),
        (this.skipLocationChange = !1),
        (this.replaceUrl = !1);
      let u = a.nativeElement.tagName?.toLowerCase();
      (this.isAnchorElement = u === "a" || u === "area"),
        this.isAnchorElement
          ? (this.subscription = n.events.subscribe((l) => {
              l instanceof $e && this.updateHref();
            }))
          : this.setTabIndexIfNotOnNativeEl("0");
    }
    setTabIndexIfNotOnNativeEl(n) {
      this.tabIndexAttribute != null ||
        this.isAnchorElement ||
        this.applyAttributeValue("tabindex", n);
    }
    ngOnChanges(n) {
      this.isAnchorElement && this.updateHref(), this.onChanges.next(this);
    }
    set routerLink(n) {
      n != null
        ? ((this.commands = Array.isArray(n) ? n : [n]),
          this.setTabIndexIfNotOnNativeEl("0"))
        : ((this.commands = null), this.setTabIndexIfNotOnNativeEl(null));
    }
    onClick(n, o, i, s, a) {
      if (
        this.urlTree === null ||
        (this.isAnchorElement &&
          (n !== 0 ||
            o ||
            i ||
            s ||
            a ||
            (typeof this.target == "string" && this.target != "_self")))
      )
        return !0;
      let c = {
        skipLocationChange: this.skipLocationChange,
        replaceUrl: this.replaceUrl,
        state: this.state,
      };
      return this.router.navigateByUrl(this.urlTree, c), !this.isAnchorElement;
    }
    ngOnDestroy() {
      this.subscription?.unsubscribe();
    }
    updateHref() {
      this.href =
        this.urlTree !== null && this.locationStrategy
          ? this.locationStrategy?.prepareExternalUrl(
              this.router.serializeUrl(this.urlTree)
            )
          : null;
      let n =
        this.href === null
          ? null
          : gd(this.href, this.el.nativeElement.tagName.toLowerCase(), "href");
      this.applyAttributeValue("href", n);
    }
    applyAttributeValue(n, o) {
      let i = this.renderer,
        s = this.el.nativeElement;
      o !== null ? i.setAttribute(s, n, o) : i.removeAttribute(s, n);
    }
    get urlTree() {
      return this.commands === null
        ? null
        : this.router.createUrlTree(this.commands, {
            relativeTo:
              this.relativeTo !== void 0 ? this.relativeTo : this.route,
            queryParams: this.queryParams,
            fragment: this.fragment,
            queryParamsHandling: this.queryParamsHandling,
            preserveFragment: this.preserveFragment,
          });
    }
  };
  (e.ɵfac = function (o) {
    return new (o || e)(U(ie), U(kt), qs("tabindex"), U(ln), U(Nt), U(tt));
  }),
    (e.ɵdir = dt({
      type: e,
      selectors: [["", "routerLink", ""]],
      hostVars: 1,
      hostBindings: function (o, i) {
        o & 1 &&
          Ke("click", function (a) {
            return i.onClick(
              a.button,
              a.ctrlKey,
              a.shiftKey,
              a.altKey,
              a.metaKey
            );
          }),
          o & 2 && ga("target", i.target);
      },
      inputs: {
        target: "target",
        queryParams: "queryParams",
        fragment: "fragment",
        queryParamsHandling: "queryParamsHandling",
        state: "state",
        relativeTo: "relativeTo",
        preserveFragment: ["preserveFragment", "preserveFragment", Jn],
        skipLocationChange: ["skipLocationChange", "skipLocationChange", Jn],
        replaceUrl: ["replaceUrl", "replaceUrl", Jn],
        routerLink: "routerLink",
      },
      standalone: !0,
      features: [pa, zn],
    }));
  let t = e;
  return t;
})();
var gi = class {};
var JC = (() => {
    let e = class e {
      constructor(n, o, i, s, a) {
        (this.router = n),
          (this.injector = i),
          (this.preloadingStrategy = s),
          (this.loader = a);
      }
      setUpPreloading() {
        this.subscription = this.router.events
          .pipe(
            fe((n) => n instanceof $e),
            It(() => this.preload())
          )
          .subscribe(() => {});
      }
      preload() {
        return this.processRoutes(this.injector, this.router.config);
      }
      ngOnDestroy() {
        this.subscription && this.subscription.unsubscribe();
      }
      processRoutes(n, o) {
        let i = [];
        for (let s of o) {
          s.providers &&
            !s._injector &&
            (s._injector = ko(s.providers, n, `Route: ${s.path}`));
          let a = s._injector ?? n,
            c = s._loadedInjector ?? a;
          ((s.loadChildren && !s._loadedRoutes && s.canLoad === void 0) ||
            (s.loadComponent && !s._loadedComponent)) &&
            i.push(this.preloadConfig(a, s)),
            (s.children || s._loadedRoutes) &&
              i.push(this.processRoutes(c, s.children ?? s._loadedRoutes));
        }
        return B(i).pipe(Gt());
      }
      preloadConfig(n, o) {
        return this.preloadingStrategy.preload(o, () => {
          let i;
          o.loadChildren && o.canLoad === void 0
            ? (i = this.loader.loadChildren(n, o))
            : (i = C(null));
          let s = i.pipe(
            $((a) =>
              a === null
                ? C(void 0)
                : ((o._loadedRoutes = a.routes),
                  (o._loadedInjector = a.injector),
                  this.processRoutes(a.injector ?? n, a.routes))
            )
          );
          if (o.loadComponent && !o._loadedComponent) {
            let a = this.loader.loadComponent(o);
            return B([s, a]).pipe(Gt());
          } else return s;
        });
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)(v(ie), v(Bo), v(ue), v(gi), v(wc));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  fh = new I(""),
  KC = (() => {
    let e = class e {
      constructor(n, o, i, s, a = {}) {
        (this.urlSerializer = n),
          (this.transitions = o),
          (this.viewportScroller = i),
          (this.zone = s),
          (this.options = a),
          (this.lastId = 0),
          (this.lastSource = "imperative"),
          (this.restoredId = 0),
          (this.store = {}),
          (a.scrollPositionRestoration =
            a.scrollPositionRestoration || "disabled"),
          (a.anchorScrolling = a.anchorScrolling || "disabled");
      }
      init() {
        this.options.scrollPositionRestoration !== "disabled" &&
          this.viewportScroller.setHistoryScrollRestoration("manual"),
          (this.routerEventsSubscription = this.createScrollEvents()),
          (this.scrollEventsSubscription = this.consumeScrollEvents());
      }
      createScrollEvents() {
        return this.transitions.events.subscribe((n) => {
          n instanceof En
            ? ((this.store[this.lastId] =
                this.viewportScroller.getScrollPosition()),
              (this.lastSource = n.navigationTrigger),
              (this.restoredId = n.restoredState
                ? n.restoredState.navigationId
                : 0))
            : n instanceof $e
            ? ((this.lastId = n.id),
              this.scheduleScrollEvent(
                n,
                this.urlSerializer.parse(n.urlAfterRedirects).fragment
              ))
            : n instanceof yt &&
              n.code === 0 &&
              ((this.lastSource = void 0),
              (this.restoredId = 0),
              this.scheduleScrollEvent(
                n,
                this.urlSerializer.parse(n.url).fragment
              ));
        });
      }
      consumeScrollEvents() {
        return this.transitions.events.subscribe((n) => {
          n instanceof ci &&
            (n.position
              ? this.options.scrollPositionRestoration === "top"
                ? this.viewportScroller.scrollToPosition([0, 0])
                : this.options.scrollPositionRestoration === "enabled" &&
                  this.viewportScroller.scrollToPosition(n.position)
              : n.anchor && this.options.anchorScrolling === "enabled"
              ? this.viewportScroller.scrollToAnchor(n.anchor)
              : this.options.scrollPositionRestoration !== "disabled" &&
                this.viewportScroller.scrollToPosition([0, 0]));
        });
      }
      scheduleScrollEvent(n, o) {
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.zone.run(() => {
              this.transitions.events.next(
                new ci(
                  n,
                  this.lastSource === "popstate"
                    ? this.store[this.restoredId]
                    : null,
                  o
                )
              );
            });
          }, 0);
        });
      }
      ngOnDestroy() {
        this.routerEventsSubscription?.unsubscribe(),
          this.scrollEventsSubscription?.unsubscribe();
      }
    };
    (e.ɵfac = function (o) {
      Ed();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function XC(t) {
  return t.routerState.root;
}
function wr(t, e) {
  return { ɵkind: t, ɵproviders: e };
}
function ew() {
  let t = p(Ae);
  return (e) => {
    let r = t.get(pn);
    if (e !== r.components[0]) return;
    let n = t.get(ie),
      o = t.get(hh);
    t.get(bc) === 1 && n.initialNavigation(),
      t.get(ph, null, M.Optional)?.setUpPreloading(),
      t.get(fh, null, M.Optional)?.init(),
      n.resetRootComponentType(r.componentTypes[0]),
      o.closed || (o.next(), o.complete(), o.unsubscribe());
  };
}
var hh = new I("", { factory: () => new re() }),
  bc = new I("", { providedIn: "root", factory: () => 1 });
function tw() {
  return wr(2, [
    { provide: bc, useValue: 0 },
    {
      provide: Go,
      multi: !0,
      deps: [Ae],
      useFactory: (e) => {
        let r = e.get(uf, Promise.resolve());
        return () =>
          r.then(
            () =>
              new Promise((n) => {
                let o = e.get(ie),
                  i = e.get(hh);
                lh(o, () => {
                  n(!0);
                }),
                  (e.get(Ic).afterPreactivation = () => (
                    n(!0), i.closed ? C(void 0) : i
                  )),
                  o.initialNavigation();
              })
          );
      },
    },
  ]);
}
function nw() {
  return wr(3, [
    {
      provide: Go,
      multi: !0,
      useFactory: () => {
        let e = p(ie);
        return () => {
          e.setUpLocationChangeListener();
        };
      },
    },
    { provide: bc, useValue: 2 },
  ]);
}
var ph = new I("");
function rw(t) {
  return wr(0, [
    { provide: ph, useExisting: JC },
    { provide: gi, useExisting: t },
  ]);
}
function ow() {
  return wr(8, [_f, { provide: mi, useExisting: _f }]);
}
function iw(t) {
  let e = [
    { provide: ah, useValue: UC },
    {
      provide: ch,
      useValue: g({ skipNextTransition: !!t?.skipInitialTransition }, t),
    },
  ];
  return wr(9, e);
}
var Of = new I("ROUTER_FORROOT_GUARD"),
  sw = [
    gn,
    { provide: mr, useClass: ar },
    ie,
    vr,
    { provide: kt, useFactory: XC, deps: [ie] },
    wc,
    [],
  ],
  Mc = (() => {
    let e = class e {
      constructor(n) {}
      static forRoot(n, o) {
        return {
          ngModule: e,
          providers: [
            sw,
            [],
            { provide: pi, multi: !0, useValue: n },
            { provide: Of, useFactory: lw, deps: [[ie, new Wn(), new Io()]] },
            { provide: Cr, useValue: o || {} },
            o?.useHash ? cw() : uw(),
            aw(),
            o?.preloadingStrategy ? rw(o.preloadingStrategy).ɵproviders : [],
            o?.initialNavigation ? dw(o) : [],
            o?.bindToComponentInputs ? ow().ɵproviders : [],
            o?.enableViewTransitions ? iw().ɵproviders : [],
            fw(),
          ],
        };
      }
      static forChild(n) {
        return {
          ngModule: e,
          providers: [{ provide: pi, multi: !0, useValue: n }],
        };
      }
    };
    (e.ɵfac = function (o) {
      return new (o || e)(v(Of, 8));
    }),
      (e.ɵmod = xe({ type: e })),
      (e.ɵinj = Se({}));
    let t = e;
    return t;
  })();
function aw() {
  return {
    provide: fh,
    useFactory: () => {
      let t = p(gf),
        e = p(L),
        r = p(Cr),
        n = p(Ic),
        o = p(mr);
      return (
        r.scrollOffset && t.setOffset(r.scrollOffset), new KC(o, n, t, e, r)
      );
    },
  };
}
function cw() {
  return { provide: tt, useClass: df };
}
function uw() {
  return { provide: tt, useClass: Ta };
}
function lw(t) {
  return "guarded";
}
function dw(t) {
  return [
    t.initialNavigation === "disabled" ? nw().ɵproviders : [],
    t.initialNavigation === "enabledBlocking" ? tw().ɵproviders : [],
  ];
}
var Rf = new I("");
function fw() {
  return [
    { provide: Rf, useFactory: ew },
    { provide: ya, multi: !0, useExisting: Rf },
  ];
}
var hw = (t, e) => ({ flipped: t, matched: e }),
  pw = (t) => ({ "background-image": t });
function gw(t, e) {
  if (t & 1) {
    let r = fn();
    F(0, "div", 5),
      Ke("click", function () {
        let i = cn(r).$implicit,
          s = hn();
        return un(s.flipCard(i));
      }),
      F(1, "div", 6),
      Je(2, "div", 7)(3, "div", 8),
      k()();
  }
  if (t & 2) {
    let r = e.$implicit;
    Y(1),
      _e("ngClass", jo(2, hw, r.flipped, r.matched)),
      Y(2),
      _e("ngStyle", Lo(5, pw, "url(" + r.image + ")"));
  }
}
function mw(t, e) {
  if (t & 1) {
    let r = fn();
    F(0, "div", 9)(1, "p"),
      W(2, "You Won!"),
      k(),
      F(3, "button", 5),
      Ke("click", function () {
        cn(r);
        let o = hn();
        return un(o.goToHomePage());
      }),
      W(4, "Play again"),
      k()();
  }
}
var mh = (() => {
  let e = class e {
    constructor() {
      (this.router = p(ie)),
        (this.cards = [
          { image: "assets/game1.png", flipped: !1, matched: !1 },
          { image: "assets/game2.png", flipped: !1, matched: !1 },
          { image: "assets/game3.png", flipped: !1, matched: !1 },
          { image: "assets/game1.png", flipped: !1, matched: !1 },
          { image: "assets/game2.png", flipped: !1, matched: !1 },
          { image: "assets/game3.png", flipped: !1, matched: !1 },
        ]),
        (this.flippedCards = []),
        (this.isFlipping = !1),
        (this.score = 0),
        (this.moves = 0),
        (this.misses = 0),
        (this.accuracy = 0),
        (this.showWinMessage = !1);
    }
    flipCard(n) {
      !this.isFlipping &&
        !n.flipped &&
        this.flippedCards.length < 2 &&
        ((n.flipped = !0),
        this.flippedCards.push(n),
        this.flippedCards.length === 2 &&
          ((this.isFlipping = !0),
          setTimeout(() => {
            this.checkMatch(),
              (this.isFlipping = !1),
              this.moves++,
              this.isGameFinished() && this.calculateAccuracy();
          }, 1e3)));
    }
    checkMatch() {
      this.flippedCards[0].image === this.flippedCards[1].image
        ? (this.flippedCards.forEach((n) => (n.matched = !0)),
          (this.score += 100),
          this.isGameFinished() &&
            ((this.showWinMessage = !0), console.log(this.showWinMessage)))
        : (this.flippedCards.forEach((n) => (n.flipped = !1)), this.misses++),
        (this.flippedCards = []);
    }
    isGameFinished() {
      return this.cards.every((n) => n.matched);
    }
    calculateAccuracy() {
      let n = this.moves + this.misses;
      n > 0 && (this.accuracy = (this.moves / n) * 100);
    }
    goToHomePage() {
      this.router.navigate(["/"]);
    }
  };
  (e.ɵfac = function (o) {
    return new (o || e)();
  }),
    (e.ɵcmp = Be({
      type: e,
      selectors: [["app-card-game"]],
      decls: 13,
      vars: 6,
      consts: [
        ["id", "bdy"],
        [1, "score-display"],
        [1, "card-game"],
        [3, "click", 4, "ngFor", "ngForOf"],
        ["class", "win-message", 4, "ngIf"],
        [3, "click"],
        [1, "card", 3, "ngClass"],
        [1, "front"],
        [1, "back", 3, "ngStyle"],
        [1, "win-message"],
      ],
      template: function (o, i) {
        o & 1 &&
          (F(0, "body", 0)(1, "div", 1)(2, "div"),
          W(3),
          k(),
          F(4, "div"),
          W(5),
          k(),
          F(6, "div"),
          W(7),
          k(),
          F(8, "div"),
          W(9),
          k()(),
          F(10, "div", 2),
          Ot(11, gw, 4, 7, "div", 3),
          k(),
          Ot(12, mw, 5, 0, "div", 4),
          k()),
          o & 2 &&
            (Y(3),
            Ne("Score: ", i.score, ""),
            Y(2),
            Ne("Moves: ", i.moves, ""),
            Y(2),
            Ne("Misses: ", i.misses, ""),
            Y(2),
            Ne("Accuracy: ", i.accuracy, ""),
            Y(2),
            _e("ngForOf", i.cards),
            Y(1),
            _e("ngIf", i.showWinMessage));
      },
      dependencies: [Zo, Yo, Qo, Jo],
      styles: [
        "#bdy[_ngcontent-%COMP%]{background-color:#f3d1a6}.card-game[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(2,1fr);gap:20px 5px;width:500px;margin-left:400px}.card-game[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]{width:150px;height:150px;perspective:1000px;cursor:pointer;position:relative;margin:auto}.card-game[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .front[_ngcontent-%COMP%], .card-game[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .back[_ngcontent-%COMP%]{width:100%;height:100%;position:absolute;backface-visibility:hidden;transition:transform .5s;border:1px solid #ddd;box-shadow:0 4px 8px #0000001a;border-radius:8px;background-size:100% 100%}.card-game[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .front[_ngcontent-%COMP%]{transform:rotateY(0);background-image:url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBUVFRYVEhUYGBgYGBoaGBgREhERGBgYGBgaGhgYGBgcIS4lHB4rHxgYJjgmKy8xNTU1GiQ7QDs0Py40NTEBDAwMEA8QGhISGDEhISE0MTQ0NTQxNDE0NDQ0ND8xNTE0NDQxNDE0NDE0NDExNDQ0NDQxNDQxNDQ0NDE0MTExNf/AABEIAOEA4QMBIgACEQEDEQH/xAAbAAADAAMBAQAAAAAAAAAAAAAAAQIDBQYHBP/EAEIQAAIBAgMEBQgGCgIDAQAAAAECAAMREiExBAUGQSJRYXGBE5GhsbLB0fAkMjRCcnMHFCNSYoKSosLhM9JDU7MV/8QAGQEBAQEBAQEAAAAAAAAAAAAAAAECAwQF/8QALREBAQACAQIEBAYCAwAAAAAAAAECEQMEIRIxUXEjMkFhBSIzNIGRgsEUQrH/2gAMAwEAAhEDEQA/AONw5eEOUrlJtlOjzJpjozKZCDo/PXKGkFDILCIKLyyMpKa+EukZbZwMkk3NokJtnrLtFDU9w9/xlXkqdT86CMHKUYxqPnlM9/VMajPw+EzYZYlQ4uJjaZWkchJYREVsvNGL3ltI1tIlLIUZCWo9URKxquZg40+eUtRrJblCoK5ygMomlEzIxspOY9cY1OR094iUm+XojN+uRUxr2QUZy1lElT6JBTrmaY3zgT5MdUIX7ISDKBl4SSMpaxHSaRNIdHz+szIoymNMl8/rmUaRCkBlCmuspdIU9DNSIEhaMQMBUxl33+EYXWKnoJSnKBKH3+6ZhMFP4e+ZprFKbDKY7S3OUgSUiefjGV98EGUb+4yaVITTwlMthEstjlEGHn3xNKeNlgRhgw5XgI3XnMqxrrJOcsQVZFSJZEQEq8RDtI+EoyTKFbshMkINpWFo1gNDAmn9WZF0mNdJkQeqWFM6QT4wgsqBZLHPzy198h9TILTQRgZRXjBlEJr5vfM8wJqZnliVL6GJhlG2kTHIxSIp6RvraCco7ZjxkUWg+kLxQIYywJLCMQJtARGEyEwjQSb3jQ2yhRnnLIkYr3jxxsVa8DJLZZQDQFi7I5PjHAYgpyMF0iSQA0MyrMa85kQ6d01EqSc5SGK3Psgh9UBqIrSlMRlE2yliCKCRc4QTm1i1h12GZnR0+E3ZQy1kIIuCFYgg6ETjy8/HxfPdbdOPhy5Plm3MifSiMw6Kk/hUn1T6d67r/VyqtUV2OeFQRhHIm/XPq4Y2t0rIinoubMDpkDY98Zc3wryYd+2/cnF8SYZdvo1v6rUNrI57kc+6YtopMl1dSpyNnBU+Yz0vb6xSm7jVEZhfS6qSLzzPaKrOS7m7MbknmZ5uj6vPqN2ySR26np8eDU3u1KmNDlJvkYJpPe8qm5TGD8+ebnZt0XQPUJAP1UUhSRa9yxBsCM9NM59Z3GhvbGMJF8CFhYm1yxNstSL3tYzzZdVx43W3bHp87N6c4DzjOU3w3CjXwVTdfrK9M3Ui2RCsTz6p81bcdZb4Ar2v/wAbYmyyPQNm16hLj1PFl23r37JeDkn0aZ2jU6R1UIbCRbXEGBBGXMcpaAWnad3O9mMjWY59LTAR8+MWEqgohhEZMSyBEASsMTiCNKHb5tCO8IGMHKNJKylkDTQzIgymNdJaGaiULpEq5xiCGA0g0FiJlBPQeGD9Gp9ze2089E9D4Z+zU+5vbafJ/F/0Z7vofh36l9nK8VfaX7k9gTFuD7RS/H7jMvFf2l+5PYExcPj6TS/F7jPRh+z/AMf9OOX7n+Xbb5+z1vy39kzzYnoz0nfP2et+W/smeanQTyfhHyZe70fiXzY+xmVs9sS30xC9+q4vIJ0mSlQc6Ix7lYz6uVnq+fJXal8JboBsSBc7sxxEoVUntBy07szMuwUiSyM1hiuAwsScK59py05WvNZu7bHw/tKTq4scZpvhOHMM1kYgjLQWM+vZdrR2tTdHJuWR1cXvqcyb9IjmNdOr4ufFe8n9vq4ck7WtdxQ7UtoV6bEE01ucs7EjpddwBNjsG8Ur072AZcIZddBckHqYIT336pO07KWrJtNOzuLE03Ngww5YGOStbkcrqSDPvfYEqOu00AVdTaolsBcD6yOv3XHpt23nTK43jxxs7yef39GJMvHcpe1vl9vV8m07Mj3SuuIi9m0dRhDXVtdL5G4nOb13O9C5BxoTYOORv9VxyPVyPKd24VkR7XLOCCRmAz9IHqOAEEdk+ZbFMLAEEOXDLiBW5JU94HqM1w82eHt6Jy8WOXv6vOHMxibTfu7vIPYZo4xIT1c1PaLjzg85qln1McplJY+dcbjbKu0YELwE0yZkrKkmFTihFihIaJZVPUyUlrrJFql0lIJKykE3GaQjQQEEMBrJgJ9WwbuqV2K0lvbMkkKAD1k+MzllJN5XUi443K6k3XyieicM/Zqfc3tGcFtezhGwY1cjU07lQerEQL+E77hgfRqfc3ttPl/il8XDjr1fQ6CeHlsvo5Pir7S/4U9kSOHx9Jpfj/xMycW/aX7k9gTHw2pO0UrC9mJNhfIKbkz1YftP8Xny/cfy7ffI+j1vy39kzznZNrak4dLXHJgGBHUQZ6jtKIUfygumFsYOmG3S9E4vaeI6S5bNs1NepqiLf+kfGfP/AA+5THLGY73/AE9nWSW45W61/brd1bQtWklRVC4xewtkQSCL94hvPeSbOqtUxWZsIwDFnYnr7Jh4Y2xq1AO9sWNgcKhRkbiwHYRPh45T9gh6qg9KPOOPDvn8OXlt1y5NcPix89Pv3ZvyjXcpTLYgC1mQrkCAc/ETl+IdgbZay1qQsjG4GYUMMyht906jx6pHA32nvpv60nd7x2BK9N6b6MMjzVh9Vh2gz1+GdPzeGd5Z3efxXm493zl7NIhDKrr9V1y00DUzY+DWtMuN0cMudsQYHPGoamgTvu4IJ0sR94zhtg3rVprhRhhuDhYAi9wTbmL4Rzm3TiYGxZDe2eFgQTcNfPQXRPMZ3vS3frHOc+N+1bTifZWULteysQCBjwaEOMIfD12OE9/fNDsvE1RCxdVe4AN7plYjK2WhtpyE63hvelPaPKUlDABQ1ntfpZPhI/is38/ZOX30uzY3Rw1KqjFSyICjm+rIMgCCDcW10M1xYz5Msd6/8Z5L/wBsb5s207fT2mi1MXV1BdFfW6jNVOmYvlzJHVOVAlK1sx6MoAT1Y4zHtHmyyuXmd4hC0c0ycRjEkwQXEJNhCRSSWJjGsyKPnwgoQ5y1OclYwM5pkxBIl5wWUMGbPcG8hRc+UF0dcDgX0P3suq/mJmqWVeYzwmeNl8q3jlcbLPON7vXh10GPZ71KTZgp02UeH1h2jxnV8ML9Gpdze204bdm96uzn9m3Rvco3SQ+HI9ono26NrNeilQrhLA3AOICxI18J8rrcOSYTHLvN+f1fQ6XLC5XKdrryctvrctWvtb4Fstku7ghB0Rex+8ewTd7Ds+z7HgphunUIW5sXck2BIH1Vv8kzWcTcQVaVRqNPCtgvTtibpLfK+Q17ZoNz1GfaaLOxZmqpcsSSekNSZ1x4eTPiniupJ5T6+7nlyYYcl1N23z9Hoe81/Y1fy39gzyZ+U9d3ov7Ct+XU9gzyIzXQY6xy92etu7i73gB70ai/uvf+pR/1M+njhPo1+p09498+LgGm6msGUgMtN1J0IbHYg8/9Tacbr9Efsen7YHvmcsZ/yNz1jpjl8DX2rkuB/tS9qVPZv7p6WonmPBTfTKfarj+xvhPUGNgT1AnzCb6jHfJGeny1hXiUtRMKnQzMJ748Fbng+vg2ykBo+JD3Mpt/cFn0cf0MO1Yh9+mjHvBZD6FWfBwwt9s2cfxg+YEn1Tc/pHI8vTHMUs/F3t6pxs+JL9naX4dn3ceIAwMYnVyDRLGYCACJpUn4xSJxQhlCRSEoSVlIZYVQjEQ1jWVkCNZN41lAguctdLDPM8p9e0IKd0IDP96+a0/4RyL9Z5aDPOfdsFDyNBtqYdJm8nQB/ezDVP5QGt2jumlYzEvit9I3Z4Z96c9O4SH0Sl3N7bTzAz1PhAfRKXc3ttPN1mO8Z7u/S3WV9nGcZD6W/wCGn7Anx7i+00PzE9Yn2cafbH/CnsCfJuH7Ts/5qe0J3xnwdfZyy/V/l6ZvUfsK35dT2DPH25T2Teo/YVvy6nsGeMsZw6Waldepu7HqXBdfHsiDmhZPM1x6CJtt5bIlWk9OpbC4w3PJiRgI7cWG3bac1+jwsqVUcW/46i9q1FNiP6R6Zt+MWtsVcgkEBLEZEHyiWIMxlj+ft6uuOX5O/o4rhfYXp7wWm46SF8XVbAbMOw4l889A35WwbNXfqpvbvKkL6SJoN1cW7L5Nalcha+EI+GmzO+G5BxAfVOticiTNJxBxK+2DyNFcFMWZsbAM/SAW9rhVBINvhO1xuWUtnk5TLHHGyVyg5TKJNWmVOE6jI2zEZnojy1036P8AZMe0l7ZU0Zv5mBRR5ix8J8fGO2CrtVQjNUtTX+TX+4tOi2Jv/wA/YC7ZV65ugOoLCyeCr0j2m04LF1+mYk3la6ZXWMhRRmIzTAIhCIGA2Mkx3ktFFYo5jyhIpKZSyVlCUMaxgyQc4AyppZl7MhdlRdWYKO9iAPXImx4aUHaqAOnlF/16ZMrqWrjN2Ru+OUFP9WoJkqI1vQoP9p885O07H9I9Kz0H5FGXxDA/5Tjbzlw/JHTl+eqRCxCqCSTYBQWJPUANZ67w7sT0dmp06gs6g3AN7EsTa/jPJNnrujB6bFWGjISpHiJ96b/2oabRU8XJ9cvLhc5o4s5hd1sOOEI2xyQc0pkX5jCBl15g+afJw6t9q2cD/wBinwBufQJg2/fFauqrXYPhN1coocdYxLbI9XYJ1PA243xjaqgsgU+Tvqxbol+wAXHbea+XDVZ+bPcdfvUfsK35VT2DPFjynubKrgqSCGBBAIORFj6J45vrdL7NUNOoDb7jcnW+TA+scjOfFNbjpzd9V6VwcFbZaL2GIIUxc7K7ZeeTxx9hrfyf/WnMX6PnvsYH7r1B5zi/ymu4z3i2LadmY9Ftnpug6nSqC1u9Rf8Aljw/mauX5HngiPOAgxnZ51JOl4W3Ujltp2no7PRNyW0dxog687X6zYc58G5N0CoDVrN5PZ0PTc6k/uIPvOezSVvzfZr4adNfJ0KeVOmOofffrb1X55klnbvWPiHfL7VVLtkoyRL/AFV7f4jqfNymtMxiZBDNuxEIXiMBExCImMGRSlGK8LwFbthHeECRHfOIRiUMmA1gdR3+6AhDmbYtoNOojj7jq3fha9pgaC6wTs9R4v3d+s7MHpdIpaols8SFekB24Tf+WeXEzteC+Jlp22eu1kv0HJyQk/UY8lJ0PK/VNjxPwWKhatsmFXObJcKrk80Oik+Y9k5Y/l7V2ynim55/V5yDLl7Tsr02KVEZGH3XGE/7HbMS6Tq4qUxn5vJUx3lROAa2HmEzV9qd8IqO7hfqh3Zwt9cIJy0HmmMxNCvSP0Z1L0Ky/u1Qf6kX/qZof0jj6WO2kntPPq4C2spS20rqiCoNNVWp/qc9v/e52lqdRxZ1pBHsLAsrP0h3gg25ZzGu7pb+WRqlmx2HZ6Kr5XaHuueGjTYeUcj94/8AjT+I5nkOc140knn3TTDYbz3m9crisqILJTQYURepR19Z1M+IiOMwm0EyryLS4BIaO8lmkCOUcV41OUKLxGMxGFO8JjuIQKWVIGsqVFX07/dC+cm8BrAotEjRQXWBRM3e5eK9p2YBFYOg+5UuQPwtqvq7Jo2iIkvdZbPJ6KONtjrrg2vZ2/mRKyjuOTDzTW7Ts25nzSvUpdipWYeZ0b1zjFgYk0tyt83Q1t37APqbc57P1SqfTkJ81Snsi6PXf8NOlSHnZmPomnGksGVm37MtZlucAIXkHYOfEgD1TCxlPJMtR0fCVay7avXslQ/0lf8AsZzc2e4q2Fq/8WzVl/sDf4zWE+6Z+rV8jJiMG0iEqMoksYCS8JDBjvJEGkUGIwvIOQgURylASMWnhLMAMloznJaFTCLFCFVeWNZiEuVDGsBrJBzjBzhDMFPvhzkJ8YVkJivAxCBSRMYCLnAuBiBlQgDZREyEbLuJ9cGMGmajVKEkc1ZfB0K++Yzz74E+6SNfGQXf1yRAGCnIQrKDIeF4ifX7pUMxGF/dCRUPJLQZtZMUihMswgy7wKvJYxMZJhSvCRihIMgjvnFeB1lRSxqZCn1xrrAqSusZMQ5GBTQUxE6RA+qA7+o+6MyQYwc/H3yi1lXkIdZWKEQot5yYMJKc+8yiZFOIawvFeA7xiQTGGg0qK/rjvMZ98KyXhf58JJMkn58ITRHWAgTEYUXzlYpiYyiYFkxXi64mgFoRQkFRmRf1yrygEaNIvGsCwYg0XwMIFExXiJivAoHX564D3xDSIGBkUyhMYMq8IDr4wvpJxeuK+ndCrJ0k39cV4sUC2MBJJjVsoF3mNjGGkOfnxgXeJm9fwkkyCYF4o2MxwZoCJlTGTGDAygxOZIMTmAXhJhGlZPjKHxhCVCjTnCEgDCEIAfnzxH4whKH8+qEISChKMIQiB74m5d0UIUxAQhAZgIQgpnWY2hCA2+fNJ5whAJJhCAjAxwgElo4QFCEJVf/Z)}.card-game[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .back[_ngcontent-%COMP%]{transform:rotateY(180deg);background-size:cover;background-position:center}.card-game[_ngcontent-%COMP%]   .card.flipped[_ngcontent-%COMP%]   .front[_ngcontent-%COMP%]{transform:rotateY(180deg)}.card-game[_ngcontent-%COMP%]   .card.flipped[_ngcontent-%COMP%]   .back[_ngcontent-%COMP%]{transform:rotateY(360deg)}.card-game[_ngcontent-%COMP%]   .card.matched[_ngcontent-%COMP%]{visibility:hidden}.score-display[_ngcontent-%COMP%]{display:flex;justify-content:space-around;font-size:22px;margin:0 10px 20px;font-weight:700;text-shadow:1px .5px}.win-message[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;background-color:#000c;padding:20px;border-radius:5px;color:#fff;height:200px;width:200px;display:flex;flex-direction:column;justify-content:center}.win-message[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0;font-size:1.5em}.win-message[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{margin-top:10px;padding:10px 20px;font-size:1em;background-color:#06c;color:#fff;border:none;border-radius:3px;cursor:pointer;transition:background-color .3s}.win-message[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background-color:#005299}",
      ],
    }));
  let t = e;
  return t;
})();
var vw = (t, e) => ({ flipped: t, matched: e }),
  yw = (t) => ({ "background-image": t });
function Dw(t, e) {
  if (t & 1) {
    let r = fn();
    F(0, "div", 5),
      Ke("click", function () {
        let i = cn(r).$implicit,
          s = hn();
        return un(s.flipCard(i));
      }),
      F(1, "div", 6),
      Je(2, "div", 7)(3, "div", 8),
      k()();
  }
  if (t & 2) {
    let r = e.$implicit;
    Y(1),
      _e("ngClass", jo(2, vw, r.flipped, r.matched)),
      Y(2),
      _e("ngStyle", Lo(5, yw, "url(" + r.image + ")"));
  }
}
function Cw(t, e) {
  if (t & 1) {
    let r = fn();
    F(0, "div", 9)(1, "p"),
      W(2, "You Won!"),
      k(),
      F(3, "button", 5),
      Ke("click", function () {
        cn(r);
        let o = hn();
        return un(o.goToHomePage());
      }),
      W(4, "Play again"),
      k()();
  }
}
var vh = (() => {
  let e = class e {
    constructor() {
      (this.router = p(ie)),
        (this.cards = [
          { image: "assets/game1.png", flipped: !1, matched: !1 },
          { image: "assets/game2.png", flipped: !1, matched: !1 },
          { image: "assets/game3.png", flipped: !1, matched: !1 },
          { image: "assets/game4.jpg", flipped: !1, matched: !1 },
          { image: "assets/game1.png", flipped: !1, matched: !1 },
          { image: "assets/game2.png", flipped: !1, matched: !1 },
          { image: "assets/game5.png", flipped: !1, matched: !1 },
          { image: "assets/game6.jpg", flipped: !1, matched: !1 },
          { image: "assets/game3.png", flipped: !1, matched: !1 },
          { image: "assets/game4.jpg", flipped: !1, matched: !1 },
          { image: "assets/game5.png", flipped: !1, matched: !1 },
          { image: "assets/game6.jpg", flipped: !1, matched: !1 },
        ]),
        (this.flippedCards = []),
        (this.isFlipping = !1),
        (this.score = 0),
        (this.moves = 0),
        (this.misses = 0),
        (this.accuracy = 0),
        (this.showWinMessage = !1);
    }
    flipCard(n) {
      !this.isFlipping &&
        !n.flipped &&
        this.flippedCards.length < 2 &&
        ((n.flipped = !0),
        this.flippedCards.push(n),
        this.flippedCards.length === 2 &&
          ((this.isFlipping = !0),
          setTimeout(() => {
            this.checkMatch(),
              (this.isFlipping = !1),
              this.moves++,
              this.isGameFinished() && this.calculateAccuracy();
          }, 2e3)));
    }
    checkMatch() {
      this.flippedCards[0].image === this.flippedCards[1].image
        ? (this.flippedCards.forEach((n) => (n.matched = !0)),
          (this.score += 100),
          this.isGameFinished() && (this.showWinMessage = !0))
        : (this.flippedCards.forEach((n) => (n.flipped = !1)), this.misses++),
        (this.flippedCards = []);
    }
    isGameFinished() {
      return this.cards.every((n) => n.matched);
    }
    calculateAccuracy() {
      let n = this.moves + this.misses;
      n > 0 && (this.accuracy = (this.moves / n) * 100);
    }
    goToHomePage() {
      this.router.navigate(["/"]);
    }
  };
  (e.ɵfac = function (o) {
    return new (o || e)();
  }),
    (e.ɵcmp = Be({
      type: e,
      selectors: [["app-card-twelve-game"]],
      decls: 13,
      vars: 6,
      consts: [
        ["id", "bdy"],
        [1, "score-display"],
        [1, "card-twelve-game"],
        [3, "click", 4, "ngFor", "ngForOf"],
        ["class", "win-message", 4, "ngIf"],
        [3, "click"],
        [1, "card", 3, "ngClass"],
        [1, "front"],
        [1, "back", 3, "ngStyle"],
        [1, "win-message"],
      ],
      template: function (o, i) {
        o & 1 &&
          (F(0, "body", 0)(1, "div", 1)(2, "div"),
          W(3),
          k(),
          F(4, "div"),
          W(5),
          k(),
          F(6, "div"),
          W(7),
          k(),
          F(8, "div"),
          W(9),
          k()(),
          F(10, "div", 2),
          Ot(11, Dw, 4, 7, "div", 3),
          k(),
          Ot(12, Cw, 5, 0, "div", 4),
          k()),
          o & 2 &&
            (Y(3),
            Ne("Score: ", i.score, ""),
            Y(2),
            Ne("Moves: ", i.moves, ""),
            Y(2),
            Ne("Misses: ", i.misses, ""),
            Y(2),
            Ne("Accuracy: ", i.accuracy, ""),
            Y(2),
            _e("ngForOf", i.cards),
            Y(1),
            _e("ngIf", i.showWinMessage));
      },
      dependencies: [Zo, Yo, Qo, Jo],
      styles: [
        "#bdy[_ngcontent-%COMP%]{background-color:#f3d1a6}.card-twelve-game[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(4,1fr);gap:20px 5px;width:600px;margin-left:350px}.card-twelve-game[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]{width:110px;height:118px;perspective:1000px;cursor:pointer;position:relative;margin:auto}.card-twelve-game[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .front[_ngcontent-%COMP%], .card-twelve-game[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .back[_ngcontent-%COMP%]{width:100%;height:100%;position:absolute;backface-visibility:hidden;transition:transform .5s;border:1px solid #ddd;box-shadow:0 4px 8px #0000001a;border-radius:8px;background-size:100% 100%}.card-twelve-game[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .front[_ngcontent-%COMP%]{transform:rotateY(0);background-image:url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBUVFRYVEhUYGBgYGBoaGBgREhERGBgYGBgaGhgYGBgcIS4lHB4rHxgYJjgmKy8xNTU1GiQ7QDs0Py40NTEBDAwMEA8QGhISGDEhISE0MTQ0NTQxNDE0NDQ0ND8xNTE0NDQxNDE0NDE0NDExNDQ0NDQxNDQxNDQ0NDE0MTExNf/AABEIAOEA4QMBIgACEQEDEQH/xAAbAAADAAMBAQAAAAAAAAAAAAAAAQIDBQYHBP/EAEIQAAIBAgMEBQgGCgIDAQAAAAECAAMREiExBAUGQSJRYXGBE5GhsbLB0fAkMjRCcnMHFCNSYoKSosLhM9JDU7MV/8QAGQEBAQEBAQEAAAAAAAAAAAAAAAECAwQF/8QALREBAQACAQIEBAYCAwAAAAAAAAECEQMEIRIxUXEjMkFhBSIzNIGRgsEUQrH/2gAMAwEAAhEDEQA/AONw5eEOUrlJtlOjzJpjozKZCDo/PXKGkFDILCIKLyyMpKa+EukZbZwMkk3NokJtnrLtFDU9w9/xlXkqdT86CMHKUYxqPnlM9/VMajPw+EzYZYlQ4uJjaZWkchJYREVsvNGL3ltI1tIlLIUZCWo9URKxquZg40+eUtRrJblCoK5ygMomlEzIxspOY9cY1OR094iUm+XojN+uRUxr2QUZy1lElT6JBTrmaY3zgT5MdUIX7ISDKBl4SSMpaxHSaRNIdHz+szIoymNMl8/rmUaRCkBlCmuspdIU9DNSIEhaMQMBUxl33+EYXWKnoJSnKBKH3+6ZhMFP4e+ZprFKbDKY7S3OUgSUiefjGV98EGUb+4yaVITTwlMthEstjlEGHn3xNKeNlgRhgw5XgI3XnMqxrrJOcsQVZFSJZEQEq8RDtI+EoyTKFbshMkINpWFo1gNDAmn9WZF0mNdJkQeqWFM6QT4wgsqBZLHPzy198h9TILTQRgZRXjBlEJr5vfM8wJqZnliVL6GJhlG2kTHIxSIp6RvraCco7ZjxkUWg+kLxQIYywJLCMQJtARGEyEwjQSb3jQ2yhRnnLIkYr3jxxsVa8DJLZZQDQFi7I5PjHAYgpyMF0iSQA0MyrMa85kQ6d01EqSc5SGK3Psgh9UBqIrSlMRlE2yliCKCRc4QTm1i1h12GZnR0+E3ZQy1kIIuCFYgg6ETjy8/HxfPdbdOPhy5Plm3MifSiMw6Kk/hUn1T6d67r/VyqtUV2OeFQRhHIm/XPq4Y2t0rIinoubMDpkDY98Zc3wryYd+2/cnF8SYZdvo1v6rUNrI57kc+6YtopMl1dSpyNnBU+Yz0vb6xSm7jVEZhfS6qSLzzPaKrOS7m7MbknmZ5uj6vPqN2ySR26np8eDU3u1KmNDlJvkYJpPe8qm5TGD8+ebnZt0XQPUJAP1UUhSRa9yxBsCM9NM59Z3GhvbGMJF8CFhYm1yxNstSL3tYzzZdVx43W3bHp87N6c4DzjOU3w3CjXwVTdfrK9M3Ui2RCsTz6p81bcdZb4Ar2v/wAbYmyyPQNm16hLj1PFl23r37JeDkn0aZ2jU6R1UIbCRbXEGBBGXMcpaAWnad3O9mMjWY59LTAR8+MWEqgohhEZMSyBEASsMTiCNKHb5tCO8IGMHKNJKylkDTQzIgymNdJaGaiULpEq5xiCGA0g0FiJlBPQeGD9Gp9ze2089E9D4Z+zU+5vbafJ/F/0Z7vofh36l9nK8VfaX7k9gTFuD7RS/H7jMvFf2l+5PYExcPj6TS/F7jPRh+z/AMf9OOX7n+Xbb5+z1vy39kzzYnoz0nfP2et+W/smeanQTyfhHyZe70fiXzY+xmVs9sS30xC9+q4vIJ0mSlQc6Ix7lYz6uVnq+fJXal8JboBsSBc7sxxEoVUntBy07szMuwUiSyM1hiuAwsScK59py05WvNZu7bHw/tKTq4scZpvhOHMM1kYgjLQWM+vZdrR2tTdHJuWR1cXvqcyb9IjmNdOr4ufFe8n9vq4ck7WtdxQ7UtoV6bEE01ucs7EjpddwBNjsG8Ur072AZcIZddBckHqYIT336pO07KWrJtNOzuLE03Ngww5YGOStbkcrqSDPvfYEqOu00AVdTaolsBcD6yOv3XHpt23nTK43jxxs7yef39GJMvHcpe1vl9vV8m07Mj3SuuIi9m0dRhDXVtdL5G4nOb13O9C5BxoTYOORv9VxyPVyPKd24VkR7XLOCCRmAz9IHqOAEEdk+ZbFMLAEEOXDLiBW5JU94HqM1w82eHt6Jy8WOXv6vOHMxibTfu7vIPYZo4xIT1c1PaLjzg85qln1McplJY+dcbjbKu0YELwE0yZkrKkmFTihFihIaJZVPUyUlrrJFql0lIJKykE3GaQjQQEEMBrJgJ9WwbuqV2K0lvbMkkKAD1k+MzllJN5XUi443K6k3XyieicM/Zqfc3tGcFtezhGwY1cjU07lQerEQL+E77hgfRqfc3ttPl/il8XDjr1fQ6CeHlsvo5Pir7S/4U9kSOHx9Jpfj/xMycW/aX7k9gTHw2pO0UrC9mJNhfIKbkz1YftP8Xny/cfy7ffI+j1vy39kzznZNrak4dLXHJgGBHUQZ6jtKIUfygumFsYOmG3S9E4vaeI6S5bNs1NepqiLf+kfGfP/AA+5THLGY73/AE9nWSW45W61/brd1bQtWklRVC4xewtkQSCL94hvPeSbOqtUxWZsIwDFnYnr7Jh4Y2xq1AO9sWNgcKhRkbiwHYRPh45T9gh6qg9KPOOPDvn8OXlt1y5NcPix89Pv3ZvyjXcpTLYgC1mQrkCAc/ETl+IdgbZay1qQsjG4GYUMMyht906jx6pHA32nvpv60nd7x2BK9N6b6MMjzVh9Vh2gz1+GdPzeGd5Z3efxXm493zl7NIhDKrr9V1y00DUzY+DWtMuN0cMudsQYHPGoamgTvu4IJ0sR94zhtg3rVprhRhhuDhYAi9wTbmL4Rzm3TiYGxZDe2eFgQTcNfPQXRPMZ3vS3frHOc+N+1bTifZWULteysQCBjwaEOMIfD12OE9/fNDsvE1RCxdVe4AN7plYjK2WhtpyE63hvelPaPKUlDABQ1ntfpZPhI/is38/ZOX30uzY3Rw1KqjFSyICjm+rIMgCCDcW10M1xYz5Msd6/8Z5L/wBsb5s207fT2mi1MXV1BdFfW6jNVOmYvlzJHVOVAlK1sx6MoAT1Y4zHtHmyyuXmd4hC0c0ycRjEkwQXEJNhCRSSWJjGsyKPnwgoQ5y1OclYwM5pkxBIl5wWUMGbPcG8hRc+UF0dcDgX0P3suq/mJmqWVeYzwmeNl8q3jlcbLPON7vXh10GPZ71KTZgp02UeH1h2jxnV8ML9Gpdze204bdm96uzn9m3Rvco3SQ+HI9ono26NrNeilQrhLA3AOICxI18J8rrcOSYTHLvN+f1fQ6XLC5XKdrryctvrctWvtb4Fstku7ghB0Rex+8ewTd7Ds+z7HgphunUIW5sXck2BIH1Vv8kzWcTcQVaVRqNPCtgvTtibpLfK+Q17ZoNz1GfaaLOxZmqpcsSSekNSZ1x4eTPiniupJ5T6+7nlyYYcl1N23z9Hoe81/Y1fy39gzyZ+U9d3ov7Ct+XU9gzyIzXQY6xy92etu7i73gB70ai/uvf+pR/1M+njhPo1+p09498+LgGm6msGUgMtN1J0IbHYg8/9Tacbr9Efsen7YHvmcsZ/yNz1jpjl8DX2rkuB/tS9qVPZv7p6WonmPBTfTKfarj+xvhPUGNgT1AnzCb6jHfJGeny1hXiUtRMKnQzMJ748Fbng+vg2ykBo+JD3Mpt/cFn0cf0MO1Yh9+mjHvBZD6FWfBwwt9s2cfxg+YEn1Tc/pHI8vTHMUs/F3t6pxs+JL9naX4dn3ceIAwMYnVyDRLGYCACJpUn4xSJxQhlCRSEoSVlIZYVQjEQ1jWVkCNZN41lAguctdLDPM8p9e0IKd0IDP96+a0/4RyL9Z5aDPOfdsFDyNBtqYdJm8nQB/ezDVP5QGt2jumlYzEvit9I3Z4Z96c9O4SH0Sl3N7bTzAz1PhAfRKXc3ttPN1mO8Z7u/S3WV9nGcZD6W/wCGn7Anx7i+00PzE9Yn2cafbH/CnsCfJuH7Ts/5qe0J3xnwdfZyy/V/l6ZvUfsK35dT2DPH25T2Teo/YVvy6nsGeMsZw6Waldepu7HqXBdfHsiDmhZPM1x6CJtt5bIlWk9OpbC4w3PJiRgI7cWG3bac1+jwsqVUcW/46i9q1FNiP6R6Zt+MWtsVcgkEBLEZEHyiWIMxlj+ft6uuOX5O/o4rhfYXp7wWm46SF8XVbAbMOw4l889A35WwbNXfqpvbvKkL6SJoN1cW7L5Nalcha+EI+GmzO+G5BxAfVOticiTNJxBxK+2DyNFcFMWZsbAM/SAW9rhVBINvhO1xuWUtnk5TLHHGyVyg5TKJNWmVOE6jI2zEZnojy1036P8AZMe0l7ZU0Zv5mBRR5ix8J8fGO2CrtVQjNUtTX+TX+4tOi2Jv/wA/YC7ZV65ugOoLCyeCr0j2m04LF1+mYk3la6ZXWMhRRmIzTAIhCIGA2Mkx3ktFFYo5jyhIpKZSyVlCUMaxgyQc4AyppZl7MhdlRdWYKO9iAPXImx4aUHaqAOnlF/16ZMrqWrjN2Ru+OUFP9WoJkqI1vQoP9p885O07H9I9Kz0H5FGXxDA/5Tjbzlw/JHTl+eqRCxCqCSTYBQWJPUANZ67w7sT0dmp06gs6g3AN7EsTa/jPJNnrujB6bFWGjISpHiJ96b/2oabRU8XJ9cvLhc5o4s5hd1sOOEI2xyQc0pkX5jCBl15g+afJw6t9q2cD/wBinwBufQJg2/fFauqrXYPhN1coocdYxLbI9XYJ1PA243xjaqgsgU+Tvqxbol+wAXHbea+XDVZ+bPcdfvUfsK35VT2DPFjynubKrgqSCGBBAIORFj6J45vrdL7NUNOoDb7jcnW+TA+scjOfFNbjpzd9V6VwcFbZaL2GIIUxc7K7ZeeTxx9hrfyf/WnMX6PnvsYH7r1B5zi/ymu4z3i2LadmY9Ftnpug6nSqC1u9Rf8Aljw/mauX5HngiPOAgxnZ51JOl4W3Ujltp2no7PRNyW0dxog687X6zYc58G5N0CoDVrN5PZ0PTc6k/uIPvOezSVvzfZr4adNfJ0KeVOmOofffrb1X55klnbvWPiHfL7VVLtkoyRL/AFV7f4jqfNymtMxiZBDNuxEIXiMBExCImMGRSlGK8LwFbthHeECRHfOIRiUMmA1gdR3+6AhDmbYtoNOojj7jq3fha9pgaC6wTs9R4v3d+s7MHpdIpaols8SFekB24Tf+WeXEzteC+Jlp22eu1kv0HJyQk/UY8lJ0PK/VNjxPwWKhatsmFXObJcKrk80Oik+Y9k5Y/l7V2ynim55/V5yDLl7Tsr02KVEZGH3XGE/7HbMS6Tq4qUxn5vJUx3lROAa2HmEzV9qd8IqO7hfqh3Zwt9cIJy0HmmMxNCvSP0Z1L0Ky/u1Qf6kX/qZof0jj6WO2kntPPq4C2spS20rqiCoNNVWp/qc9v/e52lqdRxZ1pBHsLAsrP0h3gg25ZzGu7pb+WRqlmx2HZ6Kr5XaHuueGjTYeUcj94/8AjT+I5nkOc140knn3TTDYbz3m9crisqILJTQYURepR19Z1M+IiOMwm0EyryLS4BIaO8lmkCOUcV41OUKLxGMxGFO8JjuIQKWVIGsqVFX07/dC+cm8BrAotEjRQXWBRM3e5eK9p2YBFYOg+5UuQPwtqvq7Jo2iIkvdZbPJ6KONtjrrg2vZ2/mRKyjuOTDzTW7Ts25nzSvUpdipWYeZ0b1zjFgYk0tyt83Q1t37APqbc57P1SqfTkJ81Snsi6PXf8NOlSHnZmPomnGksGVm37MtZlucAIXkHYOfEgD1TCxlPJMtR0fCVay7avXslQ/0lf8AsZzc2e4q2Fq/8WzVl/sDf4zWE+6Z+rV8jJiMG0iEqMoksYCS8JDBjvJEGkUGIwvIOQgURylASMWnhLMAMloznJaFTCLFCFVeWNZiEuVDGsBrJBzjBzhDMFPvhzkJ8YVkJivAxCBSRMYCLnAuBiBlQgDZREyEbLuJ9cGMGmajVKEkc1ZfB0K++Yzz74E+6SNfGQXf1yRAGCnIQrKDIeF4ifX7pUMxGF/dCRUPJLQZtZMUihMswgy7wKvJYxMZJhSvCRihIMgjvnFeB1lRSxqZCn1xrrAqSusZMQ5GBTQUxE6RA+qA7+o+6MyQYwc/H3yi1lXkIdZWKEQot5yYMJKc+8yiZFOIawvFeA7xiQTGGg0qK/rjvMZ98KyXhf58JJMkn58ITRHWAgTEYUXzlYpiYyiYFkxXi64mgFoRQkFRmRf1yrygEaNIvGsCwYg0XwMIFExXiJivAoHX564D3xDSIGBkUyhMYMq8IDr4wvpJxeuK+ndCrJ0k39cV4sUC2MBJJjVsoF3mNjGGkOfnxgXeJm9fwkkyCYF4o2MxwZoCJlTGTGDAygxOZIMTmAXhJhGlZPjKHxhCVCjTnCEgDCEIAfnzxH4whKH8+qEISChKMIQiB74m5d0UIUxAQhAZgIQgpnWY2hCA2+fNJ5whAJJhCAjAxwgElo4QFCEJVf/Z)}.card-twelve-game[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   .back[_ngcontent-%COMP%]{transform:rotateY(180deg);background-size:cover;background-position:center}.card-twelve-game[_ngcontent-%COMP%]   .card.flipped[_ngcontent-%COMP%]   .front[_ngcontent-%COMP%]{transform:rotateY(180deg)}.card-twelve-game[_ngcontent-%COMP%]   .card.flipped[_ngcontent-%COMP%]   .back[_ngcontent-%COMP%]{transform:rotateY(360deg)}.card-twelve-game[_ngcontent-%COMP%]   .card.matched[_ngcontent-%COMP%]{visibility:hidden}.score-display[_ngcontent-%COMP%]{display:flex;justify-content:space-around;font-size:22px;margin:0 10px 20px;font-weight:700;text-shadow:1px .5px}.win-message[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;background-color:#000c;padding:20px;border-radius:5px;color:#fff;height:200px;width:200px;display:flex;flex-direction:column;justify-content:center}.win-message[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0;font-size:1.5em}.win-message[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{margin-top:10px;padding:10px 20px;font-size:1em;background-color:#06c;color:#fff;border:none;border-radius:3px;cursor:pointer;transition:background-color .3s}.win-message[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background-color:#005299}",
      ],
    }));
  let t = e;
  return t;
})();
var yh = (() => {
  let e = class e {
    constructor(n) {
      this.router = n;
    }
    goToCardGame() {
      this.router.navigate(["/card-game"]);
    }
    goToCardTwelveGame() {
      this.router.navigate(["/card-twelve-game"]);
    }
  };
  (e.ɵfac = function (o) {
    return new (o || e)(U(ie));
  }),
    (e.ɵcmp = Be({
      type: e,
      selectors: [["app-memory-game"]],
      decls: 15,
      vars: 0,
      consts: [
        [1, "container", "mt-5"],
        [1, "text-center"],
        [1, "lead"],
        [1, "row", "justify-content-center", "mt-4"],
        [1, "col-md-6"],
        ["routerLink", "/card-game", 1, "card-option", "card-option-6"],
        ["routerLink", "/card-twelve-game", 1, "card-option", "card-option-12"],
      ],
      template: function (o, i) {
        o & 1 &&
          (F(0, "div", 0)(1, "div", 1)(2, "h1"),
          W(3, "Welcome to Card Game"),
          k(),
          F(4, "p", 2),
          W(5, "Choose the number of cards for your game"),
          k()(),
          F(6, "div", 3)(7, "div", 4)(8, "a", 5)(9, "p"),
          W(10, "6 Cards"),
          k()()(),
          F(11, "div", 4)(12, "a", 6)(13, "p"),
          W(14, "12 Cards"),
          k()()()()());
      },
      dependencies: [dh],
      styles: [
        ".card-option[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;padding:20px;text-align:center;border:1px solid #b77373;border-radius:8px;transition:background-color .3s;margin-bottom:20px;color:#000}.card-option[_ngcontent-%COMP%]:hover{scale:105%;background-color:#9acd32}.card-option-6[_ngcontent-%COMP%]{background-color:#007bff;color:#fff}.card-option-12[_ngcontent-%COMP%]{background-color:#28a745;color:#fff}h1[_ngcontent-%COMP%], p[_ngcontent-%COMP%]{text-align:center}",
      ],
    }));
  let t = e;
  return t;
})();
var ww = [
    { path: "", component: yh },
    { path: "card-game", component: mh },
    { path: "card-twelve-game", component: vh },
  ],
  Dh = (() => {
    let e = class e {};
    (e.ɵfac = function (o) {
      return new (o || e)();
    }),
      (e.ɵmod = xe({ type: e })),
      (e.ɵinj = Se({ imports: [Mc.forRoot(ww), Mc] }));
    let t = e;
    return t;
  })();
var Ch = (() => {
  let e = class e {};
  (e.ɵfac = function (o) {
    return new (o || e)();
  }),
    (e.ɵcmp = Be({
      type: e,
      selectors: [["app-root"]],
      decls: 1,
      vars: 0,
      template: function (o, i) {
        o & 1 && Je(0, "router-outlet");
      },
      dependencies: [yc],
      styles: ["[_nghost-%COMP%]{display:block}"],
    }));
  let t = e;
  return t;
})();
var wh = (() => {
  let e = class e {};
  (e.ɵfac = function (o) {
    return new (o || e)();
  }),
    (e.ɵmod = xe({ type: e, bootstrap: [Ch] })),
    (e.ɵinj = Se({ imports: [bf, Dh] }));
  let t = e;
  return t;
})();
If()
  .bootstrapModule(wh)
  .catch((t) => console.error(t));
