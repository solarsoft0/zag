import { Rect } from "../src"
import { containsPoint } from "../src/contains"
import { getRectFromPoints } from "../src/from-points"
import { collisions, intersection, intersects } from "../src/intersection"
import { inset } from "../src/operations"
import { union } from "../src/union"

describe("@zag-js/rect-utils", () => {
  test("should create rect", () => {
    const r = Rect.create({ x: 0, y: 0, width: 100, height: 100 })
    expect(r).toMatchObject({ x: 0, y: 0, width: 100, height: 100 })
  })

  test("should create rect from point", () => {
    const r = getRectFromPoints({ x: 0, y: 0 }, { x: 0, y: 50 }, { x: 10, y: 50 }, { x: 10, y: 0 }, { x: 0, y: 0 })
    expect(r).toMatchObject({ width: 10, height: 50 })
    expect(r).toMatchInlineSnapshot(`
      Rect {
        "v": Object {
          "height": 50,
          "width": 10,
          "x": 0,
          "y": 0,
        },
      }
    `)

    expect(r.corners).toMatchInlineSnapshot(`
      Object {
        "bottom": Object {
          "x": 10,
          "y": 50,
        },
        "left": Object {
          "x": 0,
          "y": 50,
        },
        "right": Object {
          "x": 10,
          "y": 0,
        },
        "top": Object {
          "x": 0,
          "y": 0,
        },
      }
    `)

    expect(containsPoint(r, { x: 10, y: 25 })).toBe(true)
  })

  test("should get the intersection of two rects", () => {
    const rectA = Rect.create({ x: 0, y: 0, width: 80, height: 100 })
    const rectB = Rect.create({ x: 60, y: 20, width: 50, height: 45 })

    const r = intersection(rectA, rectB)

    expect(r).toMatchObject({
      x: 60,
      y: 20,
      width: 20,
      height: 45,
    })

    expect(intersects(rectA, rectB)).toBeTruthy()
  })

  test("should get the collision edges between rects", () => {
    const r = Rect.create({ x: 20, y: 10, width: 20, height: 20 })
    const boundary = Rect.create({ x: 0, y: 0, width: 40, height: 30 })
    expect(intersects(r, boundary)).toBeTruthy()
    expect(collisions(r, boundary)).toMatchObject({
      right: true,
      bottom: true,
    })
  })

  describe("transformations", () => {
    const r = Rect.create({ x: 0, y: 0, width: 40, height: 30 })
    test("grow rect", () => {
      const val = inset(r, { dx: -10 })
      expect(val).toMatchObject({ x: -10, y: 0, width: 60, height: 30 })
    })
    test("shrink rect", () => {
      const val = inset(r, { dx: 5 })
      expect(val).toMatchObject({ x: 5, y: 0, width: 30, height: 30 })
    })

    test("merges rects", () => {
      const rectA = Rect.create({ x: 0, y: 0, width: 40, height: 30 })
      const rectB = Rect.create({ x: 20, y: 30, width: 20, height: 20 })
      expect(union(rectA, rectB)).toMatchObject({
        width: 40,
        height: 50,
        x: 0,
        y: 0,
      })
    })
  })
})
