/**
 * @jest-environment jsdom
 */
// CORRECTION
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {fireEvent, screen, waitFor} from "@testing-library/dom"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import { ROUTES } from "../constants/routes.js";
import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";

describe("Given I am connected as an employee and I am on the page to add a new bill", () => {

    beforeAll(() => {

        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
        })) 

    })

    describe("When I arrive to the new bill page", () => {
        test("Then new bill icon in vertical layout should be highlighted", async () => {
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.NewBill)            
            const windowIcon = await screen.findByTestId('icon-mail')
            expect(windowIcon.className).toBe('active-icon')
        })
    })

    describe("When the file input is clicked", () => {

        let newBillClass, handleChangeFile, fileElement
        beforeAll(() => {

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }

            document.body.innerHTML = NewBillUI()

            newBillClass = new NewBill({ document, onNavigate, store: mockStore, localStorage })            
            handleChangeFile = jest.fn(newBillClass.handleChangeFile)
            fileElement = screen.getByTestId('file')
            fileElement.addEventListener('change', handleChangeFile)             
        })

        beforeEach(() => {
        })
        
        describe("When the user clicks on cancel", () => {
            test("then no file should be uploaded", () => {
                fireEvent.change(fileElement, {
                    target: { files: []}
                })

                const fileUploaded = fileElement.files[0]
                expect(fileUploaded).not.toBeTruthy()                
            })
        })

        describe("When the user chooses a file", () => {

            describe("when the file format is correct", () => {
                test("Then the file is kept and its name is displayed", () => {
                    fireEvent.change(fileElement, {
                        target: { files: [new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" })]}
                    })
    
                    const fileUploaded = fileElement.files[0]
                    expect(fileUploaded.name).toBeTruthy()
                })
            })

            describe("When the file format is not allowed", () => {
    
                test("Then the file is not kept and its name not displayed", () => {
    
                    fireEvent.change(fileElement, {
                        target: { files: [new File(["(⌐□_□)"], "chucknorris.pg", { type: "image/pg" })]}
                    })
    
                    const fileUploaded = fileElement.files[0]
                    const fileExtensionIsAccepted = fileUploaded.name.match(/\.png|\.jpg|\.jpeg$/)
                    expect(fileExtensionIsAccepted).not.toBeTruthy()
                })
            })
        })
    })

    describe("When the file input is clicked", () => {
        describe("When the user chooses a file", () => {
            describe("When there is an API issue to upload the file to the db", () => {
                test("Then the file is not name within the class", async () => {

                    const onNavigate = (pathname) => {
                        document.body.innerHTML = ROUTES({ pathname })
                    }
            
                    document.body.innerHTML = NewBillUI()
            
                    let modifiedMockStore = Object.assign({}, mockStore)
                    modifiedMockStore.bills().create = async () => {
                        return Promise.reject('err')
                    }   

                    const newBillClass = new NewBill({ document, onNavigate, store: modifiedMockStore, localStorage })            
                    const fileElement = screen.getByTestId('file')

                    fireEvent.change(fileElement, {
                        target: { files: [new File(["(⌐□_□)"], "chucknorris.png", { type: "image/pg" })]}
                    })
                    
                    expect(newBillClass.fileName).not.toBeTruthy()
                })
            })
        })
    })    

    describe("When the user submits his bill", () => {
        describe("When everything has been filled correctly", () => {
            test("Then the bill is saved in DB", async () => {

                Object.defineProperty(window, 'localStorage', { value: localStorageMock })
                window.localStorage.setItem('user', JSON.stringify({
                    type: 'Employee',
                    email: 't@t'
                }))                 

                const onNavigate = (pathname) => {
                    document.body.innerHTML = ROUTES({ pathname })
                }
        
                document.body.innerHTML = NewBillUI()
                
                const newBillClass = new NewBill({ document, onNavigate, store: mockStore, localStorage })            
                const updateBill = jest.spyOn(newBillClass, 'updateBill')

                await waitFor(() => screen.getByTestId('form-new-bill')) 
                const submitButton = screen.getByTestId('form-new-bill')
                fireEvent.submit(submitButton)

                expect(updateBill).toHaveBeenCalled()
            })



        })
    })

}) 
