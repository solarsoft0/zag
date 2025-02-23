import { nextById, prevById, queryAll } from "@zag-js/dom-utils"
import { first, last } from "@zag-js/utils"
import type { MachineContext as Ctx } from "./accordion.types"

export const dom = {
  getDoc: (ctx: Ctx) => ctx.doc ?? document,

  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `accordion:${ctx.uid}`,
  getItemId: (ctx: Ctx, value: string) => ctx.ids?.item?.(value) ?? `accordion:${ctx.uid}:item:${value}`,
  getContentId: (ctx: Ctx, value: string) => ctx.ids?.content?.(value) ?? `accordion:${ctx.uid}:content:${value}`,
  getTriggerId: (ctx: Ctx, value: string) => ctx.ids?.trigger?.(value) ?? `accordion:${ctx.uid}:trigger:${value}`,

  getRootEl: (ctx: Ctx) => dom.getDoc(ctx).getElementById(dom.getRootId(ctx)),
  getTriggers: (ctx: Ctx) => {
    const ownerId = CSS.escape(dom.getRootId(ctx))
    const selector = `[aria-controls][data-ownedby='${ownerId}']:not([disabled])`
    return queryAll(dom.getRootEl(ctx), selector)
  },

  getFirstTriggerEl: (ctx: Ctx) => first(dom.getTriggers(ctx)),
  getLastTriggerEl: (ctx: Ctx) => last(dom.getTriggers(ctx)),
  getNextTriggerEl: (ctx: Ctx, id: string) => nextById(dom.getTriggers(ctx), dom.getTriggerId(ctx, id)),
  getPrevTriggerEl: (ctx: Ctx, id: string) => prevById(dom.getTriggers(ctx), dom.getTriggerId(ctx, id)),
}
