/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IViewlet } from 'vs/workbench/common/viewlet';
import { createDecorator } from 'vs/platform/instantiation/common/instantiation';
import Event from 'vs/base/common/event';
import { TPromise } from 'vs/base/common/winjs.base';
import { IPager } from 'vs/base/common/paging';
import { IQueryOptions, IExtensionManifest, LocalExtensionType } from 'vs/platform/extensionManagement/common/extensionManagement';

export const VIEWLET_ID = 'workbench.view.extensions';

export interface IExtensionsViewlet extends IViewlet {
	search(text: string): void;
}

export enum ExtensionState {
	Installing,
	Installed,
	NeedsRestart,
	Uninstalled
}

export interface IExtension {
	type: LocalExtensionType;
	state: ExtensionState;
	name: string;
	displayName: string;
	publisher: string;
	publisherDisplayName: string;
	version: string;
	latestVersion: string;
	description: string;
	iconUrl: string;
	iconUrlFallback: string;
	licenseUrl: string;
	installCount: number;
	rating: number;
	ratingCount: number;
	outdated: boolean;
	disabled: boolean;
	hasDependencies: boolean;
	telemetryData: any;
	getManifest(): TPromise<IExtensionManifest>;
	getReadme(): TPromise<string>;
	hasChangelog: boolean;
	getChangelog(): TPromise<string>;
}

export interface IExtensionDependencies {
	dependencies: IExtensionDependencies[];
	hasDependencies: boolean;
	extension: IExtension;
	dependent: IExtensionDependencies;
}

export const SERVICE_ID = 'extensionsWorkbenchService';

export const IExtensionsWorkbenchService = createDecorator<IExtensionsWorkbenchService>(SERVICE_ID);

export interface IExtensionsWorkbenchService {
	_serviceBrand: any;
	onChange: Event<void>;
	local: IExtension[];
	queryLocal(): TPromise<IExtension[]>;
	queryGallery(options?: IQueryOptions): TPromise<IPager<IExtension>>;
	canInstall(extension: IExtension): boolean;
	install(vsix: string): TPromise<void>;
	install(extension: IExtension, promptToInstallDependencies?: boolean): TPromise<void>;
	uninstall(extension: IExtension): TPromise<void>;
	loadDependencies(extension: IExtension): TPromise<IExtensionDependencies>;
	open(extension: IExtension, sideByside?: boolean): TPromise<any>;
}

export const ConfigurationKey = 'extensions';

export interface IExtensionsConfiguration {
	autoUpdate: boolean;
	recommendations: string[];
}