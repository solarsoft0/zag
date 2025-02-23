import { findByText, isHTMLElement, nextById, prevById, queryAll } from "@zag-js/dom-utils"
import { first, last } from "@zag-js/utils"
import { MachineContext as Ctx } from "./menu.types"

type HTMLEl = HTMLElement | null

export const dom = {
  getDoc: (ctx: Ctx) => ctx.doc ?? document,

  getTriggerId: (ctx: Ctx) => ctx.ids?.trigger ?? `menu:${ctx.uid}:trigger`,
  getContextTriggerId: (ctx: Ctx) => ctx.ids?.contextTrigger ?? `menu:${ctx.uid}:ctx-trigger`,
  getContentId: (ctx: Ctx) => ctx.ids?.content ?? `menu:${ctx.uid}:content`,
  getArrowId: (ctx: Ctx) => `menu:${ctx.uid}:arrow`,
  getPositionerId: (ctx: Ctx) => `menu:${ctx.uid}:popper`,
  getGroupId: (ctx: Ctx, id: string) => ctx.ids?.group?.(id) ?? `menu:${ctx.uid}:group:${id}`,
  getLabelId: (ctx: Ctx, id: string) => ctx.ids?.label?.(id) ?? `menu:${ctx.uid}:label:${id}`,

  getContentEl: (ctx: Ctx) => dom.getDoc(ctx).getElementById(dom.getContentId(ctx)) as HTMLEl,
  getPositionerEl: (ctx: Ctx) => dom.getDoc(ctx).getElementById(dom.getPositionerId(ctx)),
  getTriggerEl: (ctx: Ctx) => dom.getDoc(ctx).getElementById(dom.getTriggerId(ctx)) as HTMLEl,
  getActiveItemEl: (ctx: Ctx) => (ctx.activeId ? dom.getDoc(ctx).getElementById(ctx.activeId) : null),
  getArrowEl: (ctx: Ctx) => dom.getDoc(ctx).getElementById(dom.getArrowId(ctx)),

  getActiveElement: (ctx: Ctx) => dom.getDoc(ctx).activeElement as HTMLEl,
  getElements: (ctx: Ctx) => {
    const ownerId = CSS.escape(dom.getContentId(ctx))
    const selector = `[role=menuitem][data-ownedby=${ownerId}]:not([data-disabled])`
    return queryAll(dom.getContentEl(ctx), selector)
  },
  getFirstEl: (ctx: Ctx) => first(dom.getElements(ctx)),
  getLastEl: (ctx: Ctx) => last(dom.getElements(ctx)),
  getNextEl: (ctx: Ctx) => nextById(dom.getElements(ctx), ctx.activeId!, ctx.loop),
  getPrevEl: (ctx: Ctx) => prevById(dom.getElements(ctx), ctx.activeId!, ctx.loop),

  getElemByKey: (ctx: Ctx, key: string) => findByText(dom.getElements(ctx), key, ctx.activeId),
  getChildMenus: (ctx: Ctx) => {
    return Object.values(ctx.children)
      .map((child) => dom.getContentEl(child.state.context))
      .filter(isHTMLElement)
  },
  getParentMenus: (ctx: Ctx) => {
    const menus: HTMLElement[] = []
    let parent = ctx.parent
    while (parent) {
      const menu = dom.getContentEl(parent.state.context)
      if (menu) menus.push(menu)
      parent = parent.state.context.parent
    }
    return menus
  },

  isTargetDisabled: (v: EventTarget | null) => {
    return isHTMLElement(v) && v.dataset.disabled === ""
  },
  isTriggerItem: (el: HTMLElement | null) => {
    return !!el?.getAttribute("role")?.startsWith("menuitem") && !!el?.hasAttribute("aria-controls")
  },
}
