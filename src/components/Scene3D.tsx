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
    mobileAndTabletCheck,
} from 'webgi';
import { useConfig, MetalType } from '../contexts/ConfigContext';

type RingMesh = Mesh<BufferGeometry, MeshStandardMaterial2>;

const diamondObjectNames = [
    'diamonds',
    'diamonds001',
    'diamonds002',
    'diamonds003',
    'diamonds004',
    'diamonds005',
];

const metalBaseColors: Record<MetalType, string> = {
    'yellow-gold': '#f6c25b',
    'white-gold': '#f5f5f5',
    'rose-gold': '#f4a8a2',
    silver: '#e0e0e0',
    platinum: '#f1f1f1',
};

const getLinearColor = (value: string) => {
    try {
        return new Color(value).convertSRGBToLinear();
    } catch {
        return new Color('#ffffff').convertSRGBToLinear();
    }
};

export const Scene3D: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const viewerRef = useRef<ViewerApp | null>(null);
    const assetsRef = useRef<{
        ring?: RingMesh | null;
        silver?: RingMesh | null;
        gold?: RingMesh | null;
        diamonds: RingMesh[];
    }>({
        diamonds: [],
    });

    const { config } = useConfig();

    useEffect(() => {
        let disposed = false;

        const initViewer = async () => {
            if (!canvasRef.current) {
                return;
            }

            const viewer = new ViewerApp({
                canvas: canvasRef.current,
                useGBufferDepth: true,
                isAntialiased: false,
            });
            viewerRef.current = viewer;
            const viewerAny = viewer as any;

            viewer.renderer.displayCanvasScaling = Math.min(window.devicePixelRatio, 1);

            const manager = (await viewerAny.addPlugin(AssetManagerPlugin)) as AssetManagerPlugin;
            const importer = manager.importer as AssetImporter;

            await viewerAny.addPlugin(GBufferPlugin);
            await viewerAny.addPlugin(new ProgressivePlugin(32));
            await viewerAny.addPlugin(
                new TonemapPlugin(true, false, [
                    `vec4 vignette(vec4 color, vec2 uv, float offset, float darkness){
              uv = ( uv - vec2( 0.5 ) ) * vec2( offset );
              return vec4( mix( color.rgb, vec3( 0.17, 0.00, 0.09 ), dot( uv, uv ) ), color.a );
          }`,
                    `gl_FragColor = vignette(gl_FragColor, vUv, 1.1, 0.8);`,
                ]),
            );
            const ssr = (await viewerAny.addPlugin(SSRPlugin)) as any;
            const ssao = (await viewerAny.addPlugin(SSAOPlugin)) as any;
            await viewerAny.addPlugin(FrameFadePlugin);
            const bloom = (await viewerAny.addPlugin(BloomPlugin)) as any;
            await viewerAny.addPlugin(TemporalAAPlugin);
            await viewerAny.addPlugin(DiamondPlugin);
            await viewerAny.addPlugin(RandomizedDirectionalLightPlugin, false);

            viewer.setBackground(new Color('#ffffff').convertSRGBToLinear());

            if (ssr?.passes?.ssr?.passObject) {
                ssr.passes.ssr.passObject.lowQualityFrames = 0;
            }
            if (bloom?.pass?.passObject) {
                bloom.pass.passObject.bloomIterations = 2;
            }
            if (ssao?.passes?.ssao?.passObject?.material?.defines) {
                ssao.passes.ssao.passObject.material.defines.NUM_SAMPLES = 4;
            }

            const isMobile = mobileAndTabletCheck();
            importer.addEventListener('onLoad', async () => {
                if (disposed) {
                    return;
                }

                const ring = viewer.scene.findObjectsByName('Scene')[0] as unknown as RingMesh;
                const silver = viewer.scene.findObjectsByName('silver')[0] as unknown as RingMesh;
                const gold = viewer.scene.findObjectsByName('gold')[0] as unknown as RingMesh;
                const diamonds = diamondObjectNames
                    .map((name) => viewer.scene.findObjectsByName(name)[0] as unknown as RingMesh | undefined)
                    .filter((mesh): mesh is RingMesh => Boolean(mesh));

                assetsRef.current = { ring, silver, gold, diamonds };

                const camera = viewer.scene.activeCamera;
                camera.setCameraOptions({ fov: 0 });
                camera.position.set(0, 20, 100);
                camera.target.set(0, 0, 0);
                camera.positionUpdated(true);
                camera.targetUpdated(true);

                const controls = camera.controls as any;
                if (controls) {
                    controls.enabled = false;
                    controls.autoRotate = true;
                    controls.autoRotateSpeed = 0.2;
                    controls.minDistance = 50;
                    controls.maxDistance = 50;
                    controls.enablePan = true;
                    controls.screenSpacePanning = false;
                }

                if (isMobile) {
                    if (ssr?.passes?.ssr?.passObject?.stepCount) {
                        ssr.passes.ssr.passObject.stepCount /= 2;
                    }
                    if (bloom) {
                        bloom.enabled = false;
                    }
                    camera.setCameraOptions({ fov: 180 });
                }

                updateMaterials();
                viewer.setDirty();
            });

            await (manager as any).addFromPath('/assets/scene.glb');

            viewer.renderer.refreshPipeline();
        };

        initViewer();

        return () => {
            disposed = true;
            viewerRef.current?.dispose();
            viewerRef.current = null;
            assetsRef.current = { diamonds: [] };
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        updateMaterials();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.metalType, config.bandColor, config.diamondColor]);

    const updateMaterials = () => {
        const viewer = viewerRef.current;
        if (!viewer) {
            return;
        }

        const { silver, gold, diamonds } = assetsRef.current;
        if (silver?.material) {
            silver.material.color = getLinearColor(config.bandColor || metalBaseColors[config.metalType]);
            silver.material.metalness = 1.0;
            silver.material.roughness = 0.15;
            silver.material.needsUpdate = true;
        }

        if (gold?.material) {
            gold.material.color = getLinearColor(config.bandColor || metalBaseColors[config.metalType]);
            gold.material.metalness = 1.0;
            gold.material.roughness = 0.15;
            gold.material.needsUpdate = true;
        }

        if (diamonds.length > 0) {
            const diamondColor = getLinearColor(config.diamondColor);
            diamonds.forEach((diamond) => {
                diamond.material.color = diamondColor;
                diamond.material.roughness = 0.0;
                diamond.material.metalness = 0.0;
                diamond.material.needsUpdate = true;
            });
        }

        viewer.setDirty();
    };

    return (
        <div className="webgi-container">
            <canvas ref={canvasRef} id="webgi-canvas" className="webgi-canvas" />
        </div>
    );
};
