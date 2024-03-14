/* GENERAL PURPOSE */

function ceil2digits(number) {
    return Math.ceil(number * 100) / 100;
}

function isValidIBAN(iban) {
    iban = /^[0-9]{2}$/.test(iban.substring(0, 2)) ? 'PL' + iban : iban

    // Remove spaces and to upper case
    iban = iban.replace(/ /g, '').toUpperCase()

    if (iban == '')
        return true

    // Check basic format
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{1,35}$/.test(iban)) {
        return false;
    }

    // Rearrange and convert to numbers
    iban = iban.substring(4) + iban.substring(0, 4)
    iban = iban.split('').map(function (char) {
        if (char >= 'A' && char <= 'Z') {
            return char.charCodeAt(0) - 55 // Convert letters to numbers
        } else {
            return char
        }
    }).join('')

    // Perform mod-97 operation
    let remainder = iban
    let block

    while (remainder.length > 2) {
        block = remainder.slice(0, 9)
        remainder = parseInt(block, 10) % 97 + remainder.slice(block.length)
    }

    return parseInt(remainder, 10) % 97 === 1
}

function isValidPesel(pesel) {
    if (pesel == '')
        return true

    let peselDigits = Array.from(pesel).map(Number);
    let peselSum =
        1 * peselDigits[0] +
        3 * peselDigits[1] +
        7 * peselDigits[2] +
        9 * peselDigits[3] +
        1 * peselDigits[4] +
        3 * peselDigits[5] +
        7 * peselDigits[6] +
        9 * peselDigits[7] +
        1 * peselDigits[8] +
        3 * peselDigits[9]

    if (10 - (peselSum % 10) == peselDigits[10])
        return true
    else
        return false
}

function isValidNIP(nip) {
    if (nip == '')
        return true

    const regex = /^\d{10}$/
    return regex.test(nip)
}

function formatIBAN(iban) {
    // Remove existing spaces and non-alphanumeric characters
    iban = iban.replace(/[^A-Z0-9]/ig, '')

    // Insert first space after two characters, then every 4 characters
    return iban.substring(0, 2) + ' ' + iban.substring(2).replace(/(.{4})/g, '$1 ').trim()
}

function formatNIP(nip) {
    // Remove existing spaces and non-numeric characters
    return nip.replace(/[^0-9]/ig, '')
}

async function sendSoapRequest(url, soapEnvelope, sessionId) {
    try {
        if (sessionId) {
            var response = await fetch(url,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/soap+xml',
                        'sid': sessionId
                    },
                    body: new XMLSerializer().serializeToString(soapEnvelope)
                })
        }
        else {
            var response = await fetch(url,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/soap+xml'
                    },
                    body: new XMLSerializer().serializeToString(soapEnvelope)
                })

        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        return await response.text()
    } catch (error) {
        console.error('Error sending SOAP request:', error)

        if (!navigator.onLine)
            alert('Brak połączenia z siecią internet!')
    }
}

function extractDataFromGUSResponse(responseString) {
    const replacedString = responseString.replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#xD;/g, '')

    //Data
    const name = replacedString.match(/<Nazwa>(.*?)<\/Nazwa>/),
        street = replacedString.match(/<Ulica>(.*?)<\/Ulica>/),
        buildingNo = replacedString.match(/<NrNieruchomosci>(.*?)<\/NrNieruchomosci>/),
        apartmentNo = replacedString.match(/<NrLokalu>(.*?)<\/NrLokalu>/),
        city = replacedString.match(/<Miejscowosc>(.*?)<\/Miejscowosc>/),
        zipCode = replacedString.match(/<KodPocztowy>(.*?)<\/KodPocztowy>/)

    //Errors
    const errorCode = replacedString.match(/<ErrorCode>(.*?)<\/ErrorCode>/),
        errorMsg = replacedString.match(/<ErrorMessagePl>(.*?)<\/ErrorMessagePl>/)


    return {
        ErrorCode: errorCode ? errorCode[1].trim() : null,
        ErrorMsg: errorMsg ? errorMsg[1].trim() : null,

        Name: name ? name[1].trim() : null,
        Street: street ? street[1].trim() : null,
        BuildingNo: buildingNo ? buildingNo[1].trim() : null,
        ApartmentNo: apartmentNo ? apartmentNo[1].trim() : null,
        City: city ? city[1].trim() : null,
        ZipCode: zipCode ? zipCode[1].trim() : null
    }
}
/* DOM MANIPULATION */

function toggleAccNoDisplay() {
    let paymentMethodSelect = document.getElementById('payment-method')
    let accNoElement = document.getElementById('acc-no-td')

    if (paymentMethodSelect.value === "Przelew na konto") {
        accNoElement.style.display = ''
    } else {
        accNoElement.querySelector('#acc-no').value = ''
        accNoElement.style.display = 'none'
    }
}

function toggleSellerCompanyInputs() {
    let input = document.getElementById('seller-company-name')
    input.value = ''
    input.style.display = ''

    input = document.getElementById('seller-person-name')
    input.value = ''
    input.style.display = 'none'

    let label = document.getElementById('seller-nip-label')
    label.style.display = ''

    let div = document.getElementById('seller-nip-div')
    div.style.display = ''

    label = document.getElementById('seller-pesel-label')
    label.style.display = 'none'
    input = document.getElementById('seller-pesel')
    input.value = ''
    input.style.display = 'none'
}

function toggleSellerPersonInputs() {
    let input = document.getElementById('seller-company-name')
    input.value = ''
    input.style.display = 'none'

    input = document.getElementById('seller-person-name')
    input.value = ''
    input.style.display = ''

    let label = document.getElementById('seller-nip-label')
    label.style.display = 'none'

    let div = document.getElementById('seller-nip-div')
    div.style.display = 'none'
    document.querySelector('#seller-nip-div input').value = ''

    label = document.getElementById('seller-pesel-label')
    label.style.display = ''
    input = document.getElementById('seller-pesel')
    input.style.display = ''
}

function toggleCustomerCompanyInputs() {
    let input = document.getElementById('customer-company-name')
    input.value = ''
    input.style.display = ''

    input = document.getElementById('customer-person-name')
    input.value = ''
    input.style.display = 'none'

    let label = document.getElementById('customer-nip-label')
    label.style.display = ''

    let div = document.getElementById('customer-nip-div')
    div.style.display = ''

    label = document.getElementById('customer-pesel-label')
    label.style.display = 'none'
    input = document.getElementById('customer-pesel')
    input.value = ''
    input.style.display = 'none'
}

function toggleCustomerPersonInputs() {
    let input = document.getElementById('customer-company-name')
    input.value = ''
    input.style.display = 'none'

    input = document.getElementById('customer-person-name')
    input.value = ''
    input.style.display = ''

    let label = document.getElementById('customer-nip-label')
    label.style.display = 'none'

    let div = document.getElementById('customer-nip-div')
    div.style.display = 'none'
    document.querySelector('#customer-nip-div input').value = ''

    label = document.getElementById('customer-pesel-label')
    label.style.display = ''
    input = document.getElementById('customer-pesel')
    input.style.display = ''
}

function insertInvoiceLine() {
    fetch('./html-elems/invoice-line.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('File not found!')
            }
            return response.text();
        })
        .then(htmlString => {
            let newline = document.createElement('tr')
            newline.classList.add('invoice-line')
            newline.innerHTML += htmlString
            let table = document.querySelector('#invoice-lines-table tbody')
            table.appendChild(newline)

            //Adding event listeners to implement trailing sums at table footer and auto-calculation on some fields
            newline.querySelectorAll('.quan, .net-price, .vat-rate').forEach(input => {
                input.addEventListener('input', () => updateRow(newline))
            });

            newline.querySelectorAll('.net-amount').forEach(input => {
                input.addEventListener('input', () => updateRowOnNetValueEdit(newline))
            });

            newline.querySelectorAll('.gross-amount').forEach(input => {
                input.addEventListener('input', () => updateRowOnGrossValueEdit(newline))
            });
        })
        .catch(error => {
            console.error('There has been a problem with adding new invoice line:', error)
        });
}

function deleteInvoiceLine(button) {
    let row = button.closest('tr.invoice-line')
    if (row)
        row.remove()

    //Checking if there are any invoice lines left, if user deleted the last one
    if (!document.querySelector('.invoice-line'))
        insertInvoiceLine()

    //TODO fallback to placeholder values inside line cells if removing the last one
    updateSums()
}

function updateRow(row) {
    const quan = parseFloat(row.querySelector('td .quan').value) || 0
    const netPrice = parseFloat(row.querySelector('td .net-price').value) || 0
    const vatRate = parseFloat(row.querySelector('td .vat-rate').value) || 0

    row.querySelector('td .net-amount').value = ceil2digits(quan * netPrice)
    row.querySelector('td .gross-price').value = ceil2digits(netPrice * (1 + vatRate / 100))
    row.querySelector('td .gross-amount').value = ceil2digits(quan * netPrice * (1 + vatRate / 100))

    updateSums()
}

function updateRowOnNetValueEdit(row) {
    const netValue = parseFloat(row.querySelector('td .net-amount').value) || 0
    const quan = row.querySelector('td .quan').value
    const vatRate = parseFloat(row.querySelector('td .vat-rate').value) || 0
    const netPrice = ceil2digits(netValue / quan)

    if (quan != 0)
        row.querySelector('td .net-price').value = netPrice
    else
        row.querySelector('td .net-price').value = netValue

    row.querySelector('td .gross-price').value = ceil2digits(netPrice * (1 + vatRate / 100))
    row.querySelector('td .gross-amount').value = ceil2digits(quan * netPrice * (1 + vatRate / 100))

    updateSums()
}

function updateRowOnGrossValueEdit(row) {
    const grossValue = parseFloat(row.querySelector('td .gross-amount').value) || 0
    const vatRate = row.querySelector('td .vat-rate').value
    const quan = row.querySelector('td .quan').value
    const netValue = ceil2digits(grossValue / (1 + vatRate / 100))
    const netPrice = ceil2digits(netValue / quan)

    row.querySelector('td .net-amount').value = netValue

    if (quan != 0)
        row.querySelector('td .net-price').value = netPrice
    else
        row.querySelector('td .net-price').value = netValue

    row.querySelector('td .gross-price').value = ceil2digits(netPrice * (1 + vatRate / 100))

    updateSums()
}

function updateSums() {
    let totalNetValue = 0, totalGrossValue = 0

    document.querySelectorAll('#invoice-lines-table tbody tr').forEach(row => {
        const netValue = parseFloat(row.querySelector('td .net-amount').value) || 0
        const grossValue = parseFloat(row.querySelector('td .gross-amount').value) || 0

        totalNetValue += netValue
        totalGrossValue += grossValue
    })

    const currencyId = document.getElementById('curr-id').value
    document.getElementById('total-net-amount').value = ceil2digits(totalNetValue) + ' ' + currencyId
    document.getElementById('total-gross-amount').value = ceil2digits(totalGrossValue) + ' ' + currencyId
}

/* GENERATING INVOICE */

function amountToText(amount) {
    if (amount == 0)
        return "zero"

    const jednosci = ["", " jeden", " dwa", " trzy", " cztery", " pięć", " sześć", " siedem", " osiem", " dziewięć"];
    const nascie = ["", " jedenaście", " dwanaście", " trzynaście", " czternaście", " piętnaście", " szesnaście", " siedemnaście", " osiemnaście", " dziewietnaście"];
    const dziesiatki = ["", " dziesięć", " dwadzieścia", " trzydzieści", " czterdzieści", " pięćdziesiąt", " sześćdziesiąt", " siedemdziesiąt", " osiemdziesiąt", " dziewięćdziesiąt"];
    const setki = ["", " sto", " dwieście", " trzysta", " czterysta", " pięćset", " sześćset", " siedemset", " osiemset", " dziewięćset"];
    const grupy = [
        ["", "", ""],
        [" tysiąc", " tysiące", " tysięcy"],
        [" milion", " miliony", " milionów"],
        [" miliard", " miliardy", " miliardów"],
        [" bilion", " biliony", " bilionów"],
        [" biliard", " biliardy", " biliardów"],
        [" trylion", " tryliony", " trylionów"]];

    var amountText = '';
    var g = 0;

    while (amount > 0) {
        var s = Math.floor((amount % 1000) / 100);
        var n = 0;
        var d = Math.floor((amount % 100) / 10);
        var j = Math.floor(amount % 10);

        if (d == 1 && j > 0) {
            n = j;
            d = 0;
            j = 0;
        }

        var k = 2;
        if (j == 1 && s + d + n == 0)
            k = 0;
        if (j == 2 || j == 3 || j == 4)
            k = 1;
        if (s + d + n + j > 0)
            amountText = setki[s] + dziesiatki[d] + nascie[n] + jednosci[j] + grupy[g][k] + amountText;

        g++;
        amount = Math.floor(amount / 1000);
    }
    return amountText
}

function amountToTextPLN(amount) {
    const złotych = parseInt(amount)
    let słownieZłotych = amountToText(złotych)

    //Jeden
    if (złotych == 1)
        słownieZłotych += ' złoty'

    //Naście
    else if (złotych % 100 > 10 && złotych % 100 < 20)
        słownieZłotych += ' złotych'

    //Nie kilkanaście z końcówką dwa, trzy lub cztery
    else if (złotych % 10 == 2 || złotych % 10 == 3 || złotych % 10 == 4)
        słownieZłotych += ' złote'

    else
        słownieZłotych += ' złotych'

    const groszy = parseInt(100 * amount) - 100 * złotych
    let słownieGroszy = amountToText(groszy)

    //Jeden
    if (groszy == 1)
        słownieGroszy += ' grosz'

    //Naście
    else if (groszy % 100 > 10 && groszy % 100 < 20)
        słownieGroszy += ' groszy'

    //Nie kilkanaście z końcówką dwa, trzy lub cztery
    else if (groszy % 10 == 2 || groszy % 10 == 3 || groszy % 10 == 4)
        słownieGroszy += ' grosze'

    else
        słownieGroszy += ' groszy'

    return słownieZłotych + ' ' + słownieGroszy
}

async function loadLogoToLocalStorage() {
    const fileInput = document.getElementById('logo-upload')
    if (fileInput.files.length > 0) {
        const reader = new FileReader()
        reader.onload = (e) => {
            const imageUri = e.target.result
            localStorage.setItem('imageUri', imageUri)
        }
        return reader.readAsDataURL(fileInput.files[0])
    }
}

function generateInvoice() {
    //Checking if all required fields were filled by user
    const form = document.getElementById('invoice-form')

    if (!form.checkValidity())
        return

    fetch('./html-elems/invoice-print.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('File not found!')
            }
            return response.text();
        })
        .then(htmlString => {
            let invoice = new DOMParser().parseFromString(htmlString, 'text/html')

            //Test print watermark
            if (document.getElementById('test-print-switch').checked)
                invoice.getElementById('test-print').classList.remove('watermark-off')

            //Invoice lines
            let invoiceLinesHeader = document.createElement('thead')
            invoiceLinesHeader.appendChild(document.querySelector("#invoice-lines-table thead tr").cloneNode(true))
            invoice.querySelector(".invoice-lines").appendChild(invoiceLinesHeader)

            let invoiceLines = document.createElement('tbody')
            let lineCount = 1
            document.querySelectorAll('#invoice-lines-table tbody tr').forEach(
                (line) => {
                    let linecopy = line.cloneNode(true)
                    let newline = document.createElement('tr')
                    let td = document.createElement('td')
                    let span = document.createElement('span')
                    span.innerHTML = lineCount++
                    td.appendChild(span)
                    newline.appendChild(td)

                    linecopy.querySelectorAll('td input').forEach(
                        (input) => {
                            let td = document.createElement('td')
                            let span = document.createElement('span')
                            span.innerHTML = input.value
                            td.appendChild(span)
                            newline.appendChild(td)
                        }
                    )

                    invoiceLines.appendChild(newline)
                }
            )
            invoice.querySelector(".invoice-lines").appendChild(invoiceLines)
            invoice.querySelector('th.lp').innerHTML = 'L.p.'

            //Invoice Id
            const docTitle = document.getElementById('invoice-type').value + ' ' + document.getElementById('invoice-id').value
            invoice.getElementById('invoice-id').innerHTML = docTitle

            //Other fields
            const elementIdsToCopy = [
                'post-date',
                'sell-date',
                'payment-method',
                'payment-due-date',
                'acc-no'
            ]

            elementIdsToCopy.forEach(
                (element) => invoice.getElementById(element).innerHTML = document.getElementById(element).value
            )

            //Logo
            invoice.getElementById('logo-img').src = localStorage.getItem('imageUri')

            //Amount due
            let totalGrossAmount = 0
            document.querySelectorAll('#invoice-lines-table tbody tr').forEach(row => {
                totalGrossAmount += parseFloat(row.querySelector('td .gross-amount').value) || 0
            })

            const upfrontPaymentAmount = document.getElementById('upfront-payment-amount').value

            if (upfrontPaymentAmount > 0) {
                var amountDue = totalGrossAmount - upfrontPaymentAmount
                invoice.getElementById('upfront-payment-amount').innerHTML = amountDue + ' ' + document.getElementById('curr-id').value
            }
            else {
                let div = invoice.getElementById('upfront-payment')
                div.parentNode.removeChild(div)
                var amountDue = totalGrossAmount
            }

            invoice.getElementById('amount-due').innerHTML = amountDue + ' ' + document.getElementById('curr-id').value
            invoice.getElementById('amount-due-text').innerHTML = amountToTextPLN(amountDue)

            //Additional data
            if (document.getElementById('no-vat').checked)
                invoice.getElementById('no-vat').innerHTML = 'Podstawa zwolnienia z podatku VAT: Zwolnienie podmiotowe zg. z art. 113 ust. 1 i 9 ustawy o VAT.'

            //Seller data
            let sellerNipOrPesel = invoice.getElementById('seller-nip-or-pesel')
            let sellerName = invoice.getElementById('seller-name')
            if (document.getElementById('seller-company-btn').checked) {
                sellerNipOrPesel.innerHTML = 'NIP: ' + document.getElementById('seller-nip').value
                sellerName.innerHTML = document.getElementById('seller-company-name').value
            }
            else if (document.getElementById('seller-person-btn').checked) {
                sellerNipOrPesel.innerHTML = 'PESEL: ' + document.getElementById('seller-pesel').value
                sellerName.innerHTML = document.getElementById('seller-person-name').value
            }

            invoice.getElementById('seller-address1').innerHTML =
                document.getElementById('seller-address-street').value + ' ' +
                document.getElementById('seller-address-building-no').value

            if (document.getElementById('seller-address-apartment-no').value != '')
                invoice.getElementById('seller-address1').innerHTML += '/' +
                    document.getElementById('seller-address-apartment-no').value


            invoice.getElementById('seller-address2').innerHTML =
                document.getElementById('seller-address-city').value + ' ' +
                document.getElementById('seller-address-zip').value

            //Customer data
            let customerNipOrPesel = invoice.getElementById('customer-nip-or-pesel')
            let customerName = invoice.getElementById('customer-name')
            if (document.getElementById('customer-company-btn').checked) {
                customerNipOrPesel.innerHTML = 'NIP: ' + document.getElementById('customer-nip').value
                customerName.innerHTML = document.getElementById('customer-company-name').value
            }

            else if (document.getElementById('customer-person-btn').checked) {
                customerNipOrPesel.innerHTML = 'PESEL: ' + document.getElementById('customer-pesel').value
                customerName.innerHTML = document.getElementById('customer-person-name').value
            }

            invoice.getElementById('customer-address1').innerHTML =
                document.getElementById('customer-address-street').value + ' ' +
                document.getElementById('customer-address-building-no').value


            if (document.getElementById('customer-address-apartment-no').value != '')
                invoice.getElementById('customer-address1').innerHTML += '/' +
                    document.getElementById('customer-address-apartment-no').value


            invoice.getElementById('customer-address2').innerHTML =
                document.getElementById('customer-address-city').value + ' ' +
                document.getElementById('customer-address-zip').value

            //Opening a new tab with ready-to-print invoice
            //let invoiceWindow = window.open()
            //invoiceWindow.document.write(new XMLSerializer().serializeToString(invoice))
            //invoiceWindow.document.close()

            window.main.openInvoicePrint(new XMLSerializer().serializeToString(invoice))
        })
        .catch(error => {
            console.error('There has been a problem with generating invoice printable:', error)
        })
}

/* GUS API */
function getSellerDataFromGUS() {
    const nip = document.getElementById('seller-nip').value
    getDataFromGUS(nip)
        .then(response => {
            if (response === null)
                return

            if (response.ErrorCode) {
                errorMsg = 'Coś poszło nie tak podczas podczas pobierania danych z systemu GUS!\n\n'
                    + 'NIP: ' + nip + '\n\n'
                    + response.ErrorMsg

                alert(errorMsg)
                return
            }

            document.getElementById('seller-company-name').value = response.Name
            document.getElementById('seller-address-street').value = response.Street
            document.getElementById('seller-address-building-no').value = response.BuildingNo
            document.getElementById('seller-address-apartment-no').value = response.ApartmentNo
            document.getElementById('seller-address-city').value = response.City
            document.getElementById('seller-address-zip').value = response.ZipCode
        })
}

function getCustDataFromGUS() {
    const nip = document.getElementById('customer-nip').value
    getDataFromGUS(nip)
        .then(response => {
            if (response === null)
                return

            if (response.ErrorCode) {
                errorMsg = 'Coś poszło nie tak podczas podczas pobierania danych z systemu GUS!\n\n'
                    + 'NIP: ' + nip + '\n\n'
                    + response.ErrorMsg

                alert(errorMsg)
                return
            }

            document.getElementById('customer-company-name').value = response.Name
            document.getElementById('customer-address-street').value = response.Street
            document.getElementById('customer-address-building-no').value = response.BuildingNo
            document.getElementById('customer-address-apartment-no').value = response.ApartmentNo
            document.getElementById('customer-address-city').value = response.City
            document.getElementById('customer-address-zip').value = response.ZipCode
        })
}

async function getDataFromGUS(NIP) {
    if (NIP == '')
        return null

    //Loading REGON API access data from a file
    let apiKey, apiAddr
    await fetch('./env.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('File not found!')
            }
            return response.text();
        })
        .then(json => {
            const envVars = JSON.parse(json)
            if (envVars.STATUS == "TEST") {
                apiKey = envVars.GUS_API_KEY_TEST
                apiAddr = envVars.GUS_API_ADDR_TEST
            }
            else if (envVars.STATUS == "PROD") {
                apiKey = envVars.GUS_API_KEY_PROD
                apiAddr = envVars.GUS_API_ADDR_PROD
            }
            else
                throw new Error('Unknown or empty STATUS environmental variable.')
        })

    //Preparing API login SOAP envelope
    let loginXml = await fetch('./soap-envelopes/login.xml')
        .then(response => {
            if (!response.ok)
                throw new Error('File: login.xml not found!')

            return response.text()
        }).then(xmlString => {
            xml = new DOMParser().parseFromString(xmlString, 'text/xml')
            xml.querySelector('To').textContent = apiAddr
            xml.querySelector('pKluczUzytkownika').textContent = apiKey
            return xml
        })

    //Logging into API for session key
    const sessionId = await sendSoapRequest(apiAddr, loginXml)
        .then(response => {
            const match = response.match(/<ZalogujResult>(.*?)<\/ZalogujResult>/);

            if (match && match.length > 1) {
                return match[1];
            } else {
                return null;
            }
        })

    let nipLookupXml = await fetch('./soap-envelopes/nip-lookup.xml')
        .then(response => {
            if (!response.ok)
                throw new Error('File: nip-lookup.xml not found!')

            return response.text()

        }).then(xmlString => {
            xml = new DOMParser().parseFromString(xmlString, 'text/xml')
            xml.querySelector('To').textContent = apiAddr
            xml.querySelector('Nip').textContent = NIP
            return xml
        })

    //Getting company's information
    let companyData = await sendSoapRequest(apiAddr, nipLookupXml, sessionId)
        .then(response => {
            console.log(response)
            return extractDataFromGUSResponse(response)
        })

    //Logging out of API
    fetch('./soap-envelopes/logout.xml')
        .then(response => {
            if (!response.ok)
                throw new Error('File: logout.xml not found!')

            return response.text()

        }).then(xmlString => {
            xml = new DOMParser().parseFromString(xmlString, 'text/xml')
            xml.querySelector('To').textContent = apiAddr
            sendSoapRequest(apiAddr, xml, sessionId)
        })

    return companyData
}

/* CODE EXECUTION STARTS HERE */
localStorage.clear()
insertInvoiceLine()
updateSums()
toggleSellerCompanyInputs()
toggleCustomerCompanyInputs()

//Preventing invoice-form to clear it's inputs after submitting
document.getElementById("invoice-form").addEventListener("submit", (event) => {
    event.preventDefault()
    loadLogoToLocalStorage().then(() => generateInvoice())
})

document.getElementById('logo-upload').addEventListener('change', (event) => {
    const file = event.target.files[0]
    const maxSize = 5 * 1024 * 1024 // 5MiB

    if (file.size > maxSize) {
        alert('Rozmiar pliku przekracza 5MB. Proszę wybrać nieco mniejszy obrazek')
        event.target.value = ''
    }
})

document.addEventListener('DOMContentLoaded', function () {
    const ibanInput = document.getElementById('acc-no')
    const sellerPeselInput = document.getElementById('seller-pesel')
    const customerPeselInput = document.getElementById('customer-pesel')
    const sellerNIPInput = document.getElementById('seller-nip')
    const customerNIPInput = document.getElementById('customer-nip')

    function handleIBANValidation(input) {
        const formattedIban = formatIBAN(input.value)

        if (input.value != '')
            input.value = formattedIban

        isValidIBAN(input.value) ? input.classList.remove('error') : input.classList.add('error')
    }

    function handleNIPValidation(input) {
        const formattedNip = formatNIP(input.value)

        if (input.value != '')
            input.value = formattedNip
        isValidNIP(input.value) ? input.classList.remove('error') : input.classList.add('error')
    }

    function handlePeselValidation(input) {
        isValidPesel(input.value) ? input.classList.remove('error') : input.classList.add('error')
    }

    ibanInput.addEventListener('focus', () => ibanInput.classList.remove('error'))
    ibanInput.addEventListener('blur', () => handleIBANValidation(ibanInput))

    sellerNIPInput.addEventListener('focus', () => sellerNIPInput.classList.remove('error'))
    sellerNIPInput.addEventListener('blur', () => handleNIPValidation(sellerNIPInput))

    sellerPeselInput.addEventListener('focus', () => sellerPeselInput.classList.remove('error'))
    sellerPeselInput.addEventListener('blur', () => handlePeselValidation(sellerPeselInput))

    customerPeselInput.addEventListener('focus', () => customerPeselInput.classList.remove('error'))
    customerPeselInput.addEventListener('blur', () => handlePeselValidation(customerPeselInput))

    customerNIPInput.addEventListener('focus', () => customerNIPInput.classList.remove('error'))
    customerNIPInput.addEventListener('blur', () => handleNIPValidation(customerNIPInput))
})