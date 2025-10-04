import { useCartStore } from '../cartStore'

// Mock zustand persist
jest.mock('zustand/middleware', () => ({
  persist: (fn: any) => fn,
}))

describe('cartStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useCartStore.setState({ items: [] })
  })

  it('should add item to cart', () => {
    const { addItem, items } = useCartStore.getState()
    
    addItem(1, 2)
    
    const updatedItems = useCartStore.getState().items
    expect(updatedItems).toHaveLength(1)
    expect(updatedItems[0]).toEqual({
      product_id: 1,
      quantity: 2
    })
  })

  it('should update quantity when adding existing item', () => {
    const { addItem } = useCartStore.getState()
    
    addItem(1, 2)
    addItem(1, 3)
    
    const items = useCartStore.getState().items
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(5)
  })

  it('should update item quantity', () => {
    const { addItem, updateQuantity } = useCartStore.getState()
    
    addItem(1, 2)
    updateQuantity(1, 5)
    
    const items = useCartStore.getState().items
    expect(items[0].quantity).toBe(5)
  })

  it('should remove item when quantity is 0', () => {
    const { addItem, updateQuantity } = useCartStore.getState()
    
    addItem(1, 2)
    updateQuantity(1, 0)
    
    const items = useCartStore.getState().items
    expect(items).toHaveLength(0)
  })

  it('should remove item from cart', () => {
    const { addItem, removeItem } = useCartStore.getState()
    
    addItem(1, 2)
    addItem(2, 3)
    removeItem(1)
    
    const items = useCartStore.getState().items
    expect(items).toHaveLength(1)
    expect(items[0].product_id).toBe(2)
  })

  it('should clear cart', () => {
    const { addItem, clearCart } = useCartStore.getState()
    
    addItem(1, 2)
    addItem(2, 3)
    clearCart()
    
    const items = useCartStore.getState().items
    expect(items).toHaveLength(0)
  })

  it('should calculate total items', () => {
    const { addItem, getTotalItems } = useCartStore.getState()
    
    addItem(1, 2)
    addItem(2, 3)
    
    expect(getTotalItems()).toBe(5)
  })

  it('should calculate total price', () => {
    const { addItem, getTotalPrice } = useCartStore.getState()
    
    addItem(1, 2) // product 1: $10 each
    addItem(2, 3) // product 2: $20 each
    
    const priceMap = new Map([
      [1, 10],
      [2, 20]
    ])
    
    expect(getTotalPrice(priceMap)).toBe(80) // (2 * 10) + (3 * 20) = 80
  })

  it('should return 0 for total price when no products map provided', () => {
    const { addItem, getTotalPrice } = useCartStore.getState()
    
    addItem(1, 2)
    
    expect(getTotalPrice()).toBe(0)
  })
})
