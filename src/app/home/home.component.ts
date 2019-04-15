import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Button } from "tns-core-modules/ui/button";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { GestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { enable } from "tns-core-modules/trace/trace";
import { isAndroid, isIOS } from 'tns-core-modules/ui/page';





@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ["./home.scss"]
})
export class HomeComponent implements OnInit {
    bluetooth: any;
    bluetoothNames: Array<string> = [];

    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        this.bluetooth = require("nativescript-bluetooth");

    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onTap(args: GestureEventData) {
        // require the plugin

        this.enableBluetooth();
    }


    private enableBluetooth() {
        this.bluetooth.isBluetoothEnabled().then(enabled => {
            if (enabled) {
                this.hasCoarseLocationPermission();
            }
        });
    }

    private hasCoarseLocationPermission() {
        this.bluetooth.hasCoarseLocationPermission().then(granted => {
            // if this is 'false' you probably want to call 'requestCoarseLocationPermission' now
            if (granted) {
                this.putBluetoothOn();
            } else {
                this.requestCoarseLocationPermission();
            }
        }
        );
    }


    private requestCoarseLocationPermission() {
        this.bluetooth.requestCoarseLocationPermission().then(granted => {
            if (granted) {

            }
        });
    }

    private putBluetoothOn() {
        if(isAndroid){
            this.bluetooth.enable().then(
                enabled => {
                    if (enabled) {
                        this.scanBluetoohDevices();
                    }
                }
            );
        }else{
            this.scanBluetoohDevices();
        }
    }
    scanBluetoohDevices() {
        this.bluetooth.startScanning({
            serviceUUIDs: [],
            seconds: 15,
            onDiscovered: peripheral => {
                if (peripheral.name != null && peripheral.name != "") {
                    this.bluetoothNames = [...this.bluetoothNames, peripheral.name];
                }
            }
        }).then(() => {
            console.log("scanning complete");
            this.showDevicesDialog();
        }, err => {
            console.log("error while scanning: " + err);
        });
    }

    private showDevicesDialog() {
        dialogs.action({
            message: "Your message",
            cancelButtonText: "Cancel text",
            actions: this.bluetoothNames
        }).then(result => {
            console.log("Dialog result: " + result);
            if (result == "Option1") {
                //Do action1
            } else if (result == "Option2") {
                //Do action2
            }
        });
    }
}

