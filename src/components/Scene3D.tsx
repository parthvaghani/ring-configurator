import React, { useEffect, useRef } from 'react';
import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    FrameFadePlugin,
    BloomPlugin,
    TemporalAAPlugin,
    DiamondPlugin,
    RandomizedDirectionalLightPlugin,
    Color,
    Mesh,
    MeshStandardMaterial2,
    BufferGeometry,
    AssetImporter,
} from 'webgi';
import { useConfig } from '../contexts/ConfigContext';
import { getMetalColor } from '../utils/materials';
import * as THREE from 'three';

type RingMesh = Mesh<BufferGeometry, MeshStandardMaterial2>;

const getLinearColor = (value: string) => {
    try {
        return new Color(value).convertSRGBToLinear();
    } catch {
        return new Color('#ffffff').convertSRGBToLinear();
    }
};

const setColor = (colorObj: any, r: number, g: number, b: number) => {
    if (colorObj.setRGB) colorObj.setRGB(r, g, b);
    else {
        colorObj.r = r;
        colorObj.g = g;
        colorObj.b = b;
    }
};

export const Scene3D: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const viewerRef = useRef<ViewerApp | null>(null);
    const assetsRef = useRef<{
        metal?: RingMesh | null;
        metalMeshes: RingMesh[];
        diamonds: RingMesh[];
        gemEnvMap?: THREE.Texture | null | undefined;
        metalEnvMap?: THREE.Texture | null | undefined;
    }>({ metalMeshes: [], diamonds: [] });

    const { config } = useConfig();

    useEffect(() => {
        let disposed = false;

        const initViewer = async () => {
            if (!canvasRef.current) return;

            const viewer = new ViewerApp({
                canvas: canvasRef.current,
                useGBufferDepth: true,
                isAntialiased: true,  // Enable anti-aliasing for sharp edges
            });
            viewerRef.current = viewer;
            const viewerAny = viewer as any;

            viewer.renderer.displayCanvasScaling = Math.min(window.devicePixelRatio, 1);

            const manager = (await viewerAny.addPlugin(AssetManagerPlugin)) as AssetManagerPlugin;
            const importer = manager.importer as AssetImporter;

            await viewerAny.addPlugin(GBufferPlugin);
            await viewerAny.addPlugin(new ProgressivePlugin(64));  // Increase samples for better quality
            await viewerAny.addPlugin(new TonemapPlugin(true, false));
            await viewerAny.addPlugin(SSRPlugin);
            await viewerAny.addPlugin(SSAOPlugin);
            await viewerAny.addPlugin(FrameFadePlugin);
            await viewerAny.addPlugin(BloomPlugin);
            await viewerAny.addPlugin(TemporalAAPlugin);
            await viewerAny.addPlugin(DiamondPlugin);
            await viewerAny.addPlugin(RandomizedDirectionalLightPlugin, false);

            viewer.setBackground(new Color('#ffffff').convertSRGBToLinear());

            importer.addEventListener('onLoad', async () => {
                if (disposed) return;

                const camera = viewer.scene.activeCamera;
                camera.setCameraOptions({ fov: 0 });
                camera.position.set(0, 20, 100);
                camera.target.set(0, 0, 0);
                camera.positionUpdated(true);
                camera.targetUpdated(true);

                const controls = camera.controls as any;
                if (controls) {
                    controls.enabled = true;
                    controls.autoRotate = true;
                    controls.autoRotateSpeed = 0.2;
                    controls.minDistance = 30;
                    controls.maxDistance = 50;
                    if (controls.update) {
                        controls.update();
                    }
                }

                setTimeout(() => {
                    if (disposed) return;

                    const meshes: RingMesh[] = [];
                    viewer.scene.traverse((obj: any) => {
                        if (obj.isMesh && obj.material) meshes.push(obj as unknown as RingMesh);
                    });

                    const metalMeshes = meshes.filter((mesh) => {
                        const meshName = (mesh.name || '').toLowerCase();
                        const mat = mesh.material as any;
                        const matName = (mat?.name || '').toLowerCase();
                        return meshName === 'metal' || meshName.includes('metal') ||
                            matName === 'metal' || matName.includes('metal');
                    });

                    const diamonds = meshes.filter((mesh) => {
                        const mat = mesh.material as any;
                        const matName = (mat?.name || '').toLowerCase();
                        const meshName = (mesh.name || '').toLowerCase();
                        return matName === 'gem' || matName.includes('gem') || matName.includes('diamond') ||
                            meshName.includes('gem') || meshName.includes('diamond') || mat.extensions?.WEBGI_materials_diamond;
                    });

                    assetsRef.current = {
                        metal: metalMeshes[0] || null,
                        metalMeshes: metalMeshes,
                        diamonds
                    };

                    metalMeshes.forEach((m) => {
                        if (m?.material && assetsRef.current.metalEnvMap) {
                            const mat = m.material as any;
                            mat.envMap = assetsRef.current.metalEnvMap;
                            mat.envMap.mapping = THREE.EquirectangularReflectionMapping;
                            mat.envMapIntensity = 2.0;
                            mat.needsUpdate = true;
                        }
                    });

                    if (assetsRef.current.gemEnvMap && diamonds.length > 0) {
                        diamonds.forEach((d) => {
                            if (d.material) {
                                const mat = d.material as any;
                                mat.envMap = assetsRef.current.gemEnvMap;
                                mat.envMap.mapping = THREE.EquirectangularReflectionMapping;
                                mat.envMapIntensity = 3.0;
                                mat.needsUpdate = true;
                            }
                        });
                    }

                    viewer.setDirty();

                    const camera = viewer.scene.activeCamera;
                    const controls = camera.controls as any;
                    if (controls) {
                        if (controls.update) {
                            controls.update();
                        }
                        if (controls.autoRotate !== undefined) {
                            controls.autoRotate = true;
                        }
                    }
                }, 200);
            });

            await (manager as any).addFromPath('/assets/scene.glb');
            viewer.renderer.refreshPipeline();
        };

        initViewer();

        return () => {
            disposed = true;
            viewerRef.current?.dispose();
            viewerRef.current = null;
            assetsRef.current = { metalMeshes: [], diamonds: [] };
        };
    }, []);

    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer) return;

        const { metalMeshes, diamonds } = assetsRef.current;
        const metalColor = getMetalColor(config.metalType);
        const bandColorValue = config.bandColor && config.bandColor.startsWith('#')
            ? config.bandColor
            : metalColor;
        const bandColor = getLinearColor(bandColorValue);
        const diamondColor = getLinearColor(config.diamondColor || '#ffffff');

        metalMeshes.forEach((mesh) => {
            if (mesh?.material) {
                const mat = mesh.material as any;
                if (mat.color) setColor(mat.color, bandColor.r, bandColor.g, bandColor.b);
                mat.metalness = 1.0;
                mat.roughness = 0.15;
                if (assetsRef.current.metalEnvMap) {
                    mat.envMap = assetsRef.current.metalEnvMap;
                    mat.envMapIntensity = 2.0;
                }
                mat.needsUpdate = true;
            }
        });

        diamonds.forEach((diamond) => {
            if (diamond.material) {
                const mat = diamond.material as any;
                if (mat.color) setColor(mat.color, diamondColor.r, diamondColor.g, diamondColor.b);
                if (mat.map !== undefined) mat.map = null;
                if (mat.baseColorMap !== undefined) mat.baseColorMap = null;
                if (assetsRef.current.gemEnvMap) {
                    mat.envMap = assetsRef.current.gemEnvMap;
                    mat.envMapIntensity = 3.0;
                }
                if (mat.emissive) {
                    const e = { r: diamondColor.r * 0.2, g: diamondColor.g * 0.2, b: diamondColor.b * 0.2 };
                    setColor(mat.emissive, e.r, e.g, e.b);
                }
                if (mat.emissiveIntensity !== undefined) mat.emissiveIntensity = 0.3;
                if (mat.extensions?.WEBGI_materials_diamond) {
                    const colorInt = Math.floor(diamondColor.r * 255) * 65536 + Math.floor(diamondColor.g * 255) * 256 + Math.floor(diamondColor.b * 255);
                    mat.extensions.WEBGI_materials_diamond.color = colorInt;
                }
                mat.needsUpdate = true;
            }
        });

        viewer.setDirty();
    }, [config.metalType, config.bandColor, config.diamondColor]);

    return (
        <div className="webgi-container">
            <canvas ref={canvasRef} id="webgi-canvas" className="webgi-canvas" />
        </div>
    );
};
