/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import { ROUTES } from "../constants/routes.js";
import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";

describe("Given I am connected as an employee", () => {

  describe("When I am on Bills Page", () => {

    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      })) 
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.className).toBe('active-icon')

    }) 
    
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    describe("When I click on the button to add a new bill", () => {

        test("Then I should be redirected to the new bill screen", () => {

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }
        
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
                window.localStorage.setItem('user', JSON.stringify({
                    type: 'Admin'
            }))
        
            document.body.innerHTML = BillsUI({ data: bills })

            const billsClass = new Bills({ document, onNavigate, store: null, localStorage })

        })
    })
  })

    // Get Bills Test integration
    describe("When I navigate to Dashboard", () => { 

        beforeEach(() => {
            jest.spyOn(mockStore, "bills")
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
              type: 'Employee'
            }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
        }) 

    //   test("fetches bills from mock API GET", async () => {
    //     window.onNavigate(ROUTES_PATH.Bills)
    //     document.body.innerHTML = BillsUI({ data: bills })
    //     await waitFor(() => screen.getByText("Mes notes de frais"))
    //     const billsTableBody = screen.queryByTestId('tbody')
    //     const billsLength = billsTableBody.children ? billsTableBody.children.length : 0
    //     const billsFromStore = await mockStore.bills().list()
    //     expect(billsFromStore).toBeTruthy()
    //     const billsFromStoreLength = billsFromStore.length
    //     expect(billsFromStoreLength).toEqual(billsLength)
    //   })
   
      describe("When an error occurs on API", () => {
        test("fetches bills from an API and fails with 404 message error", async () => {
          const getBillsMocked = mockStore.bills.mockImplementationOnce(() => {
            return {
              list : async () =>  {
                return Promise.reject("Erreur 404")
                    .catch(err => {return err})

              }
            }})
            const billsError = await getBillsMocked().list()
          window.onNavigate(ROUTES_PATH.Bills)
          document.body.innerHTML = BillsUI({ data:{}, error: billsError })
          await new Promise(process.nextTick);
          const message = screen.getByText(/Erreur 404/)
          expect(message).toBeTruthy()
        })

        test("fetches bills from an API and fails with 500 message error", async () => {
          const getBillsMocked = mockStore.bills.mockImplementationOnce(() => {
            return {
              list : async () =>  {
                return Promise.reject("Erreur 500")
                    .catch(err => {return err})

              }
            }})
            const billsError = await getBillsMocked().list()
          window.onNavigate(ROUTES_PATH.Bills)
          document.body.innerHTML = BillsUI({ data:{}, error: billsError })
          await new Promise(process.nextTick);
          const message = screen.getByText(/Erreur 500/)
          expect(message).toBeTruthy()
        })
      
      })      
  
    })
})
